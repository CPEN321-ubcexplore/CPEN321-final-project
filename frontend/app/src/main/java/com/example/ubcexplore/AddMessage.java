package com.example.ubcexplore;

import android.Manifest;
import android.content.Context;
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
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(getApplicationContext(),"Need location permissions to add message!", Toast.LENGTH_SHORT).show();
        }

        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, (LocationListener) this);

        user_id = ((UserId) this.getApplication()).getUserId();
        if (user_id == null || user_id.equals("")) {
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
        String URL = getString(R.string.ip_address) + "/messages";
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

    @Override
    public void onLocationChanged(@NonNull Location location) {
        lat = (float)location.getLatitude();
        lon = (float)location.getLongitude();
    }
}