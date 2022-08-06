package com.example.ubcexplore;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.ar.core.Anchor;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.Objects;

public class ArPuzzlesActivity extends AppCompatActivity implements SensorEventListener {
    final static String TAG = "ArPuzzlesActivity";
    private ArFragment arCam;

    // Storage for Sensor readings
    float[] mGravity;
    float[] mGeomagnetic;
    float direction;

    final int UPPER = 130;
    final int LOWER = -180;
    final int DIAMETER = 50;

    boolean showPuzzle1 = false;
    boolean showPuzzle2 = false;
    boolean showPuzzle3 = false;
    boolean achievementUpdated = false;

    public static boolean checkSystemSupport(Activity activity) {
        //checking whether the API version is >= 24
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            String openGlVersion = ((ActivityManager) Objects.requireNonNull(activity.getSystemService(Context.ACTIVITY_SERVICE))).getDeviceConfigurationInfo().getGlEsVersion();
            //checking whether the OpenGL version >= 3.0
            if (Double.parseDouble(openGlVersion) >= 3.0) {
                return true;
            } else {
                Toast.makeText(activity, "App needs OpenGl Version 3.0 or later", Toast.LENGTH_SHORT).show();
                activity.finish();
                return false;
            }
        } else {
            Toast.makeText(activity, "App does not support required Build Version", Toast.LENGTH_SHORT).show();
            activity.finish();
            return false;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ar_puzzles);

        int randomDirection1 = (int) (Math.random() * (UPPER - LOWER)) + LOWER;
        int randomDirection2 = (int) (Math.random() * (UPPER - LOWER)) + LOWER;
        int randomDirection3 = (int) (Math.random() * (UPPER - LOWER)) + LOWER;
        Log.d(TAG, "rand1: " + randomDirection1 + "\n" + "rand2: " + randomDirection2 + "\n"
                + "rand3: " + randomDirection3);

        // Get a reference to the SensorManager
        SensorManager mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        Sensor magnetometer = mSensorManager
                .getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        Sensor accelerator = mSensorManager
                .getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        mSensorManager.registerListener((SensorEventListener) this, magnetometer, SensorManager.SENSOR_DELAY_NORMAL);
        mSensorManager.registerListener((SensorEventListener) this, accelerator, SensorManager.SENSOR_DELAY_NORMAL);

        if (checkSystemSupport(this)) {
            arCam = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.arPuzzleCameraArea);
            //ArFragment is linked up with its respective id used in the activity_main.xml
            assert arCam != null;
            arCam.setOnTapArPlaneListener((hitResult, plane, motionEvent) -> {
                Toast.makeText(this, ""+direction, Toast.LENGTH_SHORT).show();

                if (!showPuzzle1 && direction > randomDirection1 && direction < (randomDirection1 + DIAMETER)) {
                    Anchor anchor = hitResult.createAnchor();
                    ModelRenderable.builder()
                            .setSource(this, R.raw.ball)
                            .setIsFilamentGltf(true)
                            .build()
                            .thenAccept(modelRenderable -> addModel(anchor, modelRenderable))
                            .exceptionally(throwable -> {
                                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                                builder.setMessage(throwable.getMessage()).show();
                                return null;
                            });
                    showPuzzle1 = true;
                }
                else if (!showPuzzle2 && direction > randomDirection2 && direction < (randomDirection2 + DIAMETER)) {
                    Anchor anchor = hitResult.createAnchor();
                    ModelRenderable.builder()
                            .setSource(this, R.raw.cube)
                            .setIsFilamentGltf(true)
                            .build()
                            .thenAccept(modelRenderable -> addModel(anchor, modelRenderable))
                            .exceptionally(throwable -> {
                                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                                builder.setMessage(throwable.getMessage()).show();
                                return null;
                            });
                    showPuzzle2 = true;
                }
                else if (!showPuzzle3 && direction > randomDirection3 && direction < (randomDirection3 + DIAMETER)) {
                    Anchor anchor = hitResult.createAnchor();
                    ModelRenderable.builder()
                            .setSource(this, R.raw.pyramid)
                            .setIsFilamentGltf(true)
                            .build()
                            .thenAccept(modelRenderable -> addModel(anchor, modelRenderable))
                            .exceptionally(throwable -> {
                                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                                builder.setMessage(throwable.getMessage()).show();
                                return null;
                            });
                    showPuzzle3 = true;
                }
                if(showPuzzle1 && showPuzzle2 && showPuzzle3 && !achievementUpdated){
                    updateAchievement();
                    achievementUpdated = true;
                    unlockSecretLocation();
                }
            });
        }
    }

    private void addModel(Anchor anchor, ModelRenderable modelRenderable) {
        AnchorNode anchorNode = new AnchorNode(anchor);
        anchorNode.setParent(arCam.getArSceneView().getScene());
        TransformableNode model = new TransformableNode(arCam.getTransformationSystem());
        model.setParent(anchorNode);
        model.setRenderable(modelRenderable);
        model.select();
    }

    private void updateAchievement() {
        Log.d(TAG, "updateAchievement");
        String user_id = ((UserId) getApplication()).getUserId();
        if (!(user_id == null || user_id.equals(""))) {
            String URL = getString(R.string.ip_address) + "/users/" + user_id + "/achievements";
            RequestQueue requestQueue = Volley.newRequestQueue(this);
            JSONObject jsonBody = new JSONObject();

            try {
                jsonBody.put("id", user_id);
                jsonBody.put("Type", "collection");
                jsonBody.put("points", 3);
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
                    Toast.makeText(arCam.requireActivity(), "Congrats! You found 3 puzzles and earned 3 points!", Toast.LENGTH_SHORT).show();
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

    private void unlockSecretLocation() {
        Log.d(TAG, "unlockSecretLocation");
        String user_id = ((UserId) getApplication()).getUserId();
        if (!(user_id == null || user_id.equals(""))) {
            String URL = getString(R.string.ip_address) + "/users/" + user_id + "/locations";
            RequestQueue requestQueue = Volley.newRequestQueue(this);
            JSONObject jsonBody = new JSONObject();

            try {
                jsonBody.put("location_name", "UBC Nest");
            } catch (JSONException e) {
                e.printStackTrace();
            }
            final String requestBody = jsonBody.toString();
            StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.d(TAG, "response: " + response);
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

    @Override
    public void onSensorChanged(SensorEvent event) {

        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER)
            mGravity = event.values;

        if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD)
            mGeomagnetic = event.values;

        if (mGravity != null && mGeomagnetic != null) {
            float R[] = new float[9];

            if (SensorManager.getRotationMatrix(R, null, mGravity, mGeomagnetic)) {
                float orientation[] = new float[3];
                SensorManager.getOrientation(R, orientation);
                direction = (float)(orientation[0] * 180/3.14159);
//                float pitch = (float)(orientation[1] * 180/3.14159);
//                float roll = (float)(orientation[2] * 180/3.14159);
//                Log.d(TAG, "" + direction + "/" + pitch + "/" + roll);
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        Log.d(TAG, "accuracy: " + accuracy);
    }
}