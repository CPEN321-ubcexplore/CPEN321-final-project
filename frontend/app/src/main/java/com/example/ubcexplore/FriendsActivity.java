package com.example.ubcexplore;

import android.content.Intent;
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
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

public class FriendsActivity extends AppCompatActivity {
    final static String TAG = "FriendsActivity";
    String user_id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_friends);

        TextInputEditText addFriend_text = findViewById(R.id.enter_friend_name);
        TextInputEditText removeFriend_text = findViewById(R.id.remove_friend_name);
        addFriend_text.setVisibility(View.GONE);
        removeFriend_text.setVisibility(View.GONE);
        Button cancel_button = findViewById(R.id.button_cancel_friend);
        cancel_button.setVisibility(View.GONE);
        Button send_request_button = findViewById(R.id.button_send_request);
        send_request_button.setVisibility(View.GONE);
        Button add_friend_button = findViewById(R.id.button_add_friend);
        Button remove_friend_button = findViewById(R.id.button_remove_friend);
        Button confirm_remove_button = findViewById(R.id.button_confirm_remove);
        confirm_remove_button.setVisibility(View.GONE);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            user_id = extras.getString("user_id");
        }
        Log.d(TAG, "user_id: " + user_id);

        getFriendList();

        Button viewRequests = findViewById(R.id.button_view_requests);
        viewRequests.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent friendRequestsIntent = new Intent(FriendsActivity.this, FriendRequestsActivity.class);
                friendRequestsIntent.putExtra("user_id", user_id);
                startActivity(friendRequestsIntent);
            }
        });

        add_friend_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addFriend_text.setVisibility(View.VISIBLE);
                cancel_button.setVisibility(View.VISIBLE);
                send_request_button.setVisibility(View.VISIBLE);
                removeFriend_text.setVisibility(View.GONE);
                confirm_remove_button.setVisibility(View.GONE);
            }
        });

        cancel_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addFriend_text.setVisibility(View.GONE);
                cancel_button.setVisibility(View.GONE);
                send_request_button.setVisibility(View.GONE);
                removeFriend_text.setVisibility(View.GONE);
                confirm_remove_button.setVisibility(View.GONE);
            }
        });

        send_request_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String friendDisplayName = addFriend_text.getText().toString();
                if(friendDisplayName.length() < 3 || friendDisplayName.length() > 20) {
                    Toast.makeText(getApplicationContext(), "Name can only be between 3 and 20 characters!", Toast.LENGTH_SHORT).show();
                }
                else {
                    addFriend(friendDisplayName);
                    addFriend_text.setVisibility(View.GONE);
                    cancel_button.setVisibility(View.GONE);
                    send_request_button.setVisibility(View.GONE);
                }
            }
        });

        remove_friend_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                removeFriend_text.setVisibility(View.VISIBLE);
                cancel_button.setVisibility(View.VISIBLE);
                confirm_remove_button.setVisibility(View.VISIBLE);
                addFriend_text.setVisibility(View.GONE);
                send_request_button.setVisibility(View.GONE);
            }
        });

        confirm_remove_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String friendDisplayName = removeFriend_text.getText().toString();
                if(friendDisplayName.length() < 3 || friendDisplayName.length() > 20) {
                    Toast.makeText(getApplicationContext(), "Name can only be between 3 and 20 characters!", Toast.LENGTH_SHORT).show();
                }
                else {
                    removeFriend(friendDisplayName);
                    removeFriend_text.setVisibility(View.GONE);
                    cancel_button.setVisibility(View.GONE);
                    confirm_remove_button.setVisibility(View.GONE);
                    getFriendList();
                }
            }
        });
    }

    private void getFriendList() {
        String url = "http://20.228.168.55/users/" + user_id;
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                if(response.isEmpty()){
                    Log.d(TAG, "response is empty");
                    Toast.makeText(getApplicationContext(), "failed to get friend list", Toast.LENGTH_SHORT).show();
                }
                else if (response.equals("[]")) {
                    Toast.makeText(getApplicationContext(), "Looks like you don't have any friend...Try adding some:)", Toast.LENGTH_SHORT).show();
                }
                else {
                    Log.d(TAG, "generating friend list...");
                    TextView text_friend_list = findViewById(R.id.text_friend_list);
                    try {
                        JSONObject jsonResponse = new JSONObject(response);
                        String friendList = jsonResponse.getString("friends")
                                .replaceAll("[\\[\\]]", "").replace("\"", "").replace(",", "\n");
                        Log.d(TAG, "friendList: " + friendList);
                        text_friend_list.setText(friendList);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
                Toast.makeText(getApplicationContext(), "failed to get friend list", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(stringRequest);
    }

    private void addFriend(String friendDisplayName) {
        String URL = "http://20.228.168.55/users/" + user_id + "/friends";
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("displayName", friendDisplayName);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, response);
                Toast.makeText(getApplicationContext(), "Friend request sent!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.w(TAG, error.toString().trim());
                Toast.makeText(getApplicationContext(), "Failed to send request", Toast.LENGTH_SHORT).show();
                Toast.makeText(getApplicationContext(), "Name doesn't exist/request already sent/already friends", Toast.LENGTH_SHORT).show();
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

    private void removeFriend(String friendDisplayName) {
        String URL = "http://20.228.168.55/users/" + user_id + "/friends/" + friendDisplayName;
        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                Toast.makeText(getApplicationContext(), "Removed successfully!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
                Toast.makeText(getApplicationContext(), "Remove failed", Toast.LENGTH_SHORT).show();
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        requestQueue.add(stringRequest);
    }
}