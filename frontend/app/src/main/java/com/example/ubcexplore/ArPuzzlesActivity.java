package com.example.ubcexplore;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.LocationListener;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.ar.core.Anchor;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import java.util.Objects;

public class ArPuzzlesActivity extends AppCompatActivity implements SensorEventListener {
    final static String TAG = "ArPuzzlesActivity";
    private ArFragment arCam;
    private int clickNo = 0;

    private Sensor magnetometer, accelerator;
    private SensorManager mSensorManager;
    // Storage for Sensor readings
    float[] mGravity;
    float[] mGeomagnetic;
    float direction;

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

        // Get a reference to the SensorManager
        mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        magnetometer = mSensorManager
                .getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        accelerator = mSensorManager
                .getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        mSensorManager.registerListener((SensorEventListener) this, magnetometer, SensorManager.SENSOR_DELAY_NORMAL);
        mSensorManager.registerListener((SensorEventListener) this, accelerator, SensorManager.SENSOR_DELAY_NORMAL);

        if (checkSystemSupport(this)) {
            arCam = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.arPuzzleCameraArea);
            //ArFragment is linked up with its respective id used in the activity_main.xml
            assert arCam != null;
            arCam.setOnTapArPlaneListener((hitResult, plane, motionEvent) -> {
                Toast.makeText(this, ""+direction, Toast.LENGTH_SHORT).show();
                if (direction > 120.0 && direction < 140.0) {
                    clickNo++;
                    if (clickNo == 1) {
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
                    } else if (clickNo == 2) {
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
                    } else if (clickNo == 3) {
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
                    }
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
                float pitch = (float)(orientation[1] * 180/3.14159);
                float roll = (float)(orientation[2] * 180/3.14159);
//                Log.d(TAG, "" + direction + "/" + pitch + "/" + roll);
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }
}