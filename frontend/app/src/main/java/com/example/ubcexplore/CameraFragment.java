package com.example.ubcexplore;

import android.Manifest;
import android.app.AlertDialog;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.common.util.concurrent.ListenableFuture;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ThreadLocalRandom;

public class CameraFragment extends Fragment implements LocationListener {
    private static final String CHANNEL_ID = "0";
    private GoogleSignInClient mGoogleSignInClient;
    private final int RC_SIGN_IN = 1;
    final static String TAG = "CameraFragment";
    private static final String serverClientId = "239633515511-9g9p4kdqcvnnrnjq28uskbetjch6e2nc.apps.googleusercontent.com";
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    String message = "";
    float lat = 90;
    float lon = 180;
    float old_lat = 90;
    float old_lon = 180;
    boolean reachedLocation = false;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        // Request a CameraProvider
        super.onCreate(savedInstanceState);
        cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext());

        // https://developer.android.com/training/notify-user/build-notification#java
        createNotificationChannel();

        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(serverClientId)
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(requireContext(), gso);

        updateCoords();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        checkLocationPermissions();

        // https://developer.android.com/training/camerax/preview#java (create a camera preview)
        // Check for CameraProvider availability
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                bindPreview(cameraProvider);
            } catch (ExecutionException | InterruptedException e) {
                // No errors need to be handled for this Future.
                // This should never be reached.
            }
        }, ContextCompat.getMainExecutor(requireContext()));
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_camera, container, false);

        view.findViewById(R.id.login_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signIn();
            }
        });

        view.findViewById(R.id.button_add_message).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkLocationPermissions();
                if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION)==
                        PackageManager.PERMISSION_GRANTED &&
                        ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)==
                                PackageManager.PERMISSION_GRANTED) {
                    Intent intent = new Intent(getActivity(), AddMessage.class);
                    startActivity(intent);
                }
                else {
                    Toast.makeText(requireContext(), "Need location permissions to add message!", Toast.LENGTH_SHORT).show();
                }
            }
        });

        view.findViewById(R.id.button_view_message).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getMessages();
            }
        });

        view.findViewById(R.id.logout_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logout();
            }
        });

        view.findViewById(R.id.button_add_location).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), AddLocationActivity.class);
                startActivity(intent);
            }
        });

        view.findViewById(R.id.button_view_ar).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(reachedLocation) {
                    Intent intent = new Intent(getActivity(), ArActivity.class);
                    startActivity(intent);
                }
                else {
                    AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                    builder.setMessage(R.string.viewARwarning)
                            .setNeutralButton("OK", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {

                                }
                            })
                            .create().show();
                }
            }
        });

        return view;
    }

    private void updateCoords() {
        checkLocationPermissions();
        LocationManager locationManager = (LocationManager) requireActivity().getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
        Log.d(TAG, "lat: " + lat + ", lon: " + lon);
    }

    private void getMessages() {
        if (lat == (float)90 && lon == (float)180) {
            return;
        }

        String URL =  getString(R.string.ip_address) + "/messages/?coordinate_latitude=" + lat + "&coordinate_longitude=" + lon + "&radius=1";
        StringRequest stringRequest = new StringRequest(URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                if (Objects.equals(response, "[]")) {
                    Toast.makeText(requireContext(), "There is no message at your current location, try adding some!", Toast.LENGTH_SHORT).show();
                }
                else {
                    try {
                        JSONArray jsonArray = new JSONArray(response);
                        int length = jsonArray.length();
                        Log.d(TAG, "Number of messages: " + length);
                        if (length == 0) {
                            Toast.makeText(requireContext(), "There is no message at your current location, try adding some!", Toast.LENGTH_SHORT).show();
                        }
                        else {
                            int i = ThreadLocalRandom.current().nextInt(0, length);
                            JSONObject jsonObject = jsonArray.getJSONObject(i);
                            message = jsonObject.getString("message_text");
                            Log.d(TAG, "message: " + message);
                            // Set the notification content
                            NotificationCompat.Builder builder = new NotificationCompat.Builder(requireContext(), CHANNEL_ID)
                                    .setSmallIcon(R.drawable.notification_icon)
                                    .setContentTitle("New Message")
                                    .setContentText(message)
                                    .setPriority(NotificationCompat.PRIORITY_DEFAULT);
                            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(requireContext());

                            int notificationId = 0;
                            notificationManager.notify(notificationId, builder.build());
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, error.toString().trim());
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(this.requireContext());
        requestQueue.add(stringRequest);
    }

    private void signIn() {
        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(requireContext());
        if(account != null) {
            updateUI(account);
        }
        else {
            if(mGoogleSignInClient == null) {
                GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                        .requestEmail()
                        .requestIdToken(serverClientId)
                        .build();

                // Build a GoogleSignInClient with the options specified by gso.
                mGoogleSignInClient = GoogleSignIn.getClient(requireContext(), gso);
            }
            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
            startActivityForResult(signInIntent, RC_SIGN_IN);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            // Signed in successfully, show authenticated UI.
            updateUI(account);
        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
            updateUI(null);
        }
    }

    private void updateUI(GoogleSignInAccount account) {
        String credentials;
        if (account == null) {
            Log.d(TAG, "There is no user signed in");
            Toast.makeText(requireContext(), "Sign in failed", Toast.LENGTH_SHORT).show();
        }
        else {
            Log.d(TAG, "Name: " + account.getGivenName() + " " + account.getFamilyName());
            credentials = account.getIdToken();
            Log.d(TAG, "Credentials: " + credentials);

            Intent profileIntent = new Intent(getActivity(), ProfileActivity.class);
            profileIntent.putExtra("credentials", credentials);
            startActivity(profileIntent);
        }
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "UBC Explore";
            String description = "Message notifications";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = requireActivity().getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    // Select a camera and bind the lifecycle and use cases
    void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {
        Preview preview = new Preview.Builder()
                .build();

        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                .build();

        PreviewView previewView = requireView().findViewById(R.id.previewView);
        preview.setSurfaceProvider(previewView.getSurfaceProvider());

        cameraProvider.bindToLifecycle(this, cameraSelector, preview);
    }

    private void checkLocationPermissions(){
        if (!(ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION)==
                PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)==
                        PackageManager.PERMISSION_GRANTED)) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(), Manifest.permission.ACCESS_COARSE_LOCATION) ||
                    ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(), Manifest.permission.ACCESS_FINE_LOCATION)) {
                Toast.makeText(getContext(), "We need these location permissions to run",
                        Toast.LENGTH_LONG).show();
                new AlertDialog.Builder(getContext())
                        .setTitle("Need location permission")
                        .setMessage("We need the location permission to run")
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                Toast.makeText(getContext(), "We need these location permissions to run",
                                        Toast.LENGTH_LONG).show();
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ActivityCompat.requestPermissions(requireActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                                        Manifest.permission.ACCESS_FINE_LOCATION}, 1);
                            }
                        }).create().show();
            } else {
                ActivityCompat.requestPermissions(requireActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        old_lat = lat;
        old_lon = lon;
        lat = (float)location.getLatitude();
        lon = (float)location.getLongitude();
        if(Math.abs(old_lat-lat) > 0.001 || Math.abs(old_lon-lon) > 0.001) {
            Log.d(TAG, "Location changed!");
            getLocationInfo();
        }
    }

    private void getLocationInfo() {
        TextView locationInfo = requireView().findViewById(R.id.text_location_info);
        String URL = getString(R.string.ip_address) + "/locations/?coordinate_latitude=" + lat + "&coordinate_longitude=" + lon + "&radius=0.001";
        StringRequest stringRequest = new StringRequest(URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                if (!Objects.equals(response, "[]")) {
                    reachedLocation = true;
                    try {
                        JSONArray jsonArray = new JSONArray(response);
                        JSONObject jsonObject = jsonArray.getJSONObject(0);
                        String location_name = jsonObject.getString("location_name");
                        String about = jsonObject.getString("about");
                        String fun_facts = jsonObject.getString("fun_facts");
                        String displayInfo = "Congrats! You have reached " + location_name + "!\n" +
                                about + "\n" + fun_facts + "\n";
                        locationInfo.setText(displayInfo);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    updateAchievement();
                }
                else {
                    locationInfo.setText("");
                    reachedLocation = false;
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, error.toString().trim());
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(this.requireContext());
        requestQueue.add(stringRequest);
    }

    private void updateAchievement() {
        Log.d(TAG, "updateAchievement");
        String user_id = ((UserId) requireActivity().getApplication()).getUserId();
        if (!(user_id == null || user_id.equals(""))) {
            String URL = getString(R.string.ip_address) + "/users/" + user_id + "/achievements";
            RequestQueue requestQueue = Volley.newRequestQueue(requireContext());
            JSONObject jsonBody = new JSONObject();

            try {
                jsonBody.put("id", user_id);
                jsonBody.put("Type", "collection");
                jsonBody.put("points", 2);
                jsonBody.put("image", "image");
            } catch (JSONException e) {
                e.printStackTrace();
            }
            final String requestBody = jsonBody.toString();
            StringRequest stringRequest = new StringRequest(Request.Method.PUT, URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.d(TAG, "response: " + response);
                    Log.d(TAG, "Achievements updated!");
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG, "Error: " + error.toString().trim());
                }
            }) {
                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                public byte[] getBody() throws AuthFailureError {
                    try {
                        return requestBody == null ? null : requestBody.getBytes("utf-8");
                    } catch (UnsupportedEncodingException uee) {
                        VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                        return null;
                    }
                }
            };
            requestQueue.add(stringRequest);
        }
    }

    public void logout(){
        ((UserId) requireActivity().getApplication()).setUserId("");
        mGoogleSignInClient.signOut()
        .addOnCompleteListener(requireActivity(), new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                Toast.makeText(getActivity(), "You have logged out successfully!",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
}