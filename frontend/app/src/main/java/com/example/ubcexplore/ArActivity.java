package com.example.ubcexplore;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.widget.Toast;

import com.google.ar.core.Anchor;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import java.util.Objects;

// AR models credit
// Coyote by Poly by Google [CC-BY], via Poly Pizza
// Wolf by Poly by Google [CC-BY], via Poly Pizza
// Hummingbird by Poly by Google [CC-BY], via Poly Pizza
// Cactus wren by Poly by Google [CC-BY], via Poly Pizza
// Sparrow by Poly by Google [CC-BY], via Poly Pizza
// Raccoon by Poly by Google [CC-BY], via Poly Pizza
public class ArActivity extends AppCompatActivity {
    private ArFragment arCam;
    private int clickNo = 0;

    // adapted from https://www.geeksforgeeks.org/how-to-build-a-simple-augmented-reality-android-app/
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
        setContentView(R.layout.activity_ar);

        int arModelNum = (int) (Math.random() * 7);

        int arModel;

        if (arModelNum == 0) {
            arModel = R.raw.wolf;
        } else if (arModelNum == 1) {
            arModel = R.raw.coyote;
        } else if (arModelNum == 2) {
            arModel = R.raw.falcon;
        } else if (arModelNum == 3) {
            arModel = R.raw.hummingbird;
        } else if (arModelNum == 4) {
            arModel = R.raw.raccoon;
        } else if (arModelNum == 5) {
            arModel = R.raw.sparrow;
        } else {
            arModel = R.raw.cactus_wren;
        }

        if (checkSystemSupport(this)) {
            arCam = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.arCameraArea);
            //ArFragment is linked up with its respective id used in the activity_main.xml
            assert arCam != null;
            arCam.setOnTapArPlaneListener((hitResult, plane, motionEvent) -> {
                clickNo++;
                if (clickNo == 1) {
                    Anchor anchor = hitResult.createAnchor();
                    ModelRenderable.builder()
                            .setSource(this, arModel)
                            .setIsFilamentGltf(true)
                            .build()
                            .thenAccept(modelRenderable -> addModel(anchor, modelRenderable))
                            .exceptionally(throwable -> {
                                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                                builder.setMessage(throwable.getMessage()).show();
                                return null;
                            });
                }
            });
        }
    }

    private void addModel(Anchor anchor, ModelRenderable modelRenderable) {
        AnchorNode anchorNode = new AnchorNode(anchor);
        anchorNode.setParent(arCam.getArSceneView().getScene());
        TransformableNode model = new TransformableNode(arCam.getTransformationSystem());
        model.getScaleController().setMinScale(0.1f);
        model.getScaleController().setMaxScale(1.0f);
        model.setLocalScale(new Vector3(0.5f, 0.5f, 0.5f));
        model.setParent(anchorNode);
        model.setRenderable(modelRenderable);
        model.select();
    }
}