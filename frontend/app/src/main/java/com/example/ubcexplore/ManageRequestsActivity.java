package com.example.ubcexplore;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

public class ManageRequestsActivity extends AppCompatActivity {
    final static String TAG = "ManageRequestsActivity";
    String user_id;
    String username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manage_requests);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            user_id = extras.getString("user_id");
            username = extras.getString("username");
        }

        TextView manage_requests = findViewById(R.id.manage_requests);
        manage_requests.setText("You have a friend request from " + username);

        Button accept_request = findViewById(R.id.accept_request);
        Button decline_request = findViewById(R.id.decline_request);

        accept_request.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                acceptFriendRequest();
                ManageRequestsActivity.this.finish();
            }
        });

        decline_request.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                declineFriendRequest();
                ManageRequestsActivity.this.finish();
            }
        });
    }

    private void acceptFriendRequest() {
        String URL = "http://20.228.168.55/users/" + user_id + "/requests";
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("displayName", username);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.PUT, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, response);
                Toast.makeText(getApplicationContext(), "Friend request accepted!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.w(TAG, error.toString().trim());
                Toast.makeText(getApplicationContext(), "Failed to accept", Toast.LENGTH_SHORT).show();
            }
        }) {
            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
            }

            @Override
            public byte[] getBody() throws AuthFailureError {
                try {
                    return requestBody.getBytes("utf-8");
                } catch (UnsupportedEncodingException uee) {
                    VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                    return null;
                }
            }
        };
        requestQueue.add(stringRequest);
    }

    private void declineFriendRequest() {
        String URL = "http://20.228.168.55/users/" + user_id + "/friends/" + username;
        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                Toast.makeText(getApplicationContext(), "Friend request denied!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "Decline failed", Toast.LENGTH_SHORT).show();
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        requestQueue.add(stringRequest);
    }
}