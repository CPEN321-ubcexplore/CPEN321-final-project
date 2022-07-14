package com.example.ubcexplore;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

public class AddMessage extends AppCompatActivity implements LocationListener {
    final static String TAG = "AddMessage";
    EditText addMessageInput;
    Button submitButton;
    String user_id;
    int login;
    float lat;
    float lon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_message);

        checkLocationPermissions();
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, (LocationListener) this);

        user_id = ((UserId) this.getApplication()).getUserId();
        if (user_id == null || user_id == "") {
            login = 0;
        } else {
            login = 1;
        }

        submitButton=findViewById(R.id.submit_message_button);
        addMessageInput=(EditText) findViewById(R.id.addMessage_input);
        submitButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if (login == 0) {
                    Toast.makeText(getApplicationContext(),"Please login first!", Toast.LENGTH_SHORT).show();
                    AddMessage.this.finish();
                } else {
                    String message = addMessageInput.getText().toString();
                    Log.d(TAG, "user id: " + user_id);
                    Log.d(TAG, "lat: " + lat + ", lon: " + lon);
                    submitMessage(message, lat, lon, user_id);
                }
            }
        });
    }

    private void submitMessage(String message,float lat, float lon, String id){
        if(addMessageInput.getText().toString().matches("")){
            Toast.makeText(this, "Your message is empty. Please add something before submitting.",
                    Toast.LENGTH_SHORT).show();
        }else {
            uploadMessage(message,lat,lon,id);
            addMessageInput.setText("");
        }
    }
    private void uploadMessage(String message,float lat, float lon, String id){

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String URL = "http://20.228.168.55/messages";
        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("coordinate_latitude", String.valueOf(lat));
            jsonBody.put("coordinate_longitude", String.valueOf(lon));
            jsonBody.put("message_text", message);
            jsonBody.put("user_account_id", id);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                Toast.makeText(getApplicationContext(), "Message uploaded successfully!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
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
    private void checkLocationPermissions(){
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)==
                PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)==
                        PackageManager.PERMISSION_GRANTED){

        }
        {
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,Manifest.permission.ACCESS_COARSE_LOCATION)||
                    ActivityCompat.shouldShowRequestPermissionRationale(this,Manifest.permission.ACCESS_FINE_LOCATION)){
                Toast.makeText(AddMessage.this,"We need these location permissions to run",
                        Toast.LENGTH_LONG).show();
                new AlertDialog.Builder(this)
                        .setTitle("Need location permission")
                        .setMessage("We need the location permission to mark your location on a map")
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                Toast.makeText(AddMessage.this,"We need these location permissions to run",
                                        Toast.LENGTH_LONG).show();
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ActivityCompat.requestPermissions(AddMessage.this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                                        Manifest.permission.ACCESS_FINE_LOCATION},1);
                            }
                        }).create().show();
            }
            else{
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.ACCESS_FINE_LOCATION},1);
            }
        }
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        lat = (float)location.getLatitude();
        lon = (float)location.getLongitude();
    }
}