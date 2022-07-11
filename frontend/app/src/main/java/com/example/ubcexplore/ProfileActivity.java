package com.example.ubcexplore;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

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

public class ProfileActivity extends AppCompatActivity {
    final static String TAG = "ProfileActivity";
    String credentials;
    String user_id;
    String displayName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        TextView name = findViewById(R.id.name);

        TextInputEditText editName = findViewById(R.id.enter_display_name);
        editName.setVisibility(View.GONE);
        Button cancel_button = findViewById(R.id.button_cancel);
        cancel_button.setVisibility(View.GONE);
        Button confirm_button = findViewById(R.id.button_confirm);
        confirm_button.setVisibility(View.GONE);
        Button edit_name_button = findViewById(R.id.button_edit_name);
        Button friends_button = findViewById(R.id.button_friends);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            credentials = extras.getString("credentials");
        }
        Log.d(TAG, "credentials: " + credentials);
        getAccountInfo(credentials);
        name.setText(displayName);

        friends_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent friendsIntent = new Intent(ProfileActivity.this, FriendsActivity.class);
                friendsIntent.putExtra("user_id", user_id);
                startActivity(friendsIntent);
            }
        });

        edit_name_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editName.setVisibility(View.VISIBLE);
                cancel_button.setVisibility(View.VISIBLE);
                confirm_button.setVisibility(View.VISIBLE);
            }
        });

        cancel_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editName.setVisibility(View.GONE);
                cancel_button.setVisibility(View.GONE);
                confirm_button.setVisibility(View.GONE);
            }
        });

        confirm_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String new_name = editName.getText().toString();
                if(new_name.length() < 3 || new_name.length() > 20) {
                    Toast.makeText(getApplicationContext(), "Name must be between 3 and 20 characters!", Toast.LENGTH_SHORT).show();
                }
                else {
                    checkName(new_name);
                    editName.setVisibility(View.GONE);
                    cancel_button.setVisibility(View.GONE);
                    confirm_button.setVisibility(View.GONE);
                }
            }
        });
    }

    private void getAccountInfo(String credentials) {
        String URL = "http://20.228.168.55/users/login";
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("token", credentials);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, response);
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    displayName = jsonResponse.getString("displayName");
                    user_id = jsonResponse.getString("id");
                    ((UserId) getApplication()).setUserId(user_id);
                    Log.d(TAG, "Check userid: " + ((UserId) getApplication()).getUserId());

                    String score = jsonResponse.getString("score");
                    JSONObject collection = jsonResponse.getJSONObject("collection");
                    String achievements = collection.getString("achievements");
                    String items = collection.getString("items");
                    // String achievements = "[\"location1\",\"location2\"]";
                    // String items = "[\"item1\",\"item2\"]";
                    Log.d(TAG, "achievements: " + achievements + ", items: " + items);
                    String achievementList = achievements.replaceAll("[\\[\\]]", "").replace("\"", "").replace(",", "\n");
                    String itemList = items.replaceAll("[\\[\\]]", "").replace("\"", "").replace(",", "\n");
                    TextView name = findViewById(R.id.name);
                    name.setText(displayName);
                    TextView score_text = findViewById(R.id.score);
                    score_text.setText("Score: " + score);
                    TextView achievement_list = findViewById(R.id.text_achievement);
                    achievement_list.setText(achievementList);
                    TextView item_list = findViewById(R.id.text_item);
                    item_list.setText(itemList);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.w(TAG, error.toString().trim());
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
                    return requestBody.getBytes("utf-8");
                } catch (UnsupportedEncodingException uee) {
                    VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                    return null;
                }
            }
        };
        requestQueue.add(stringRequest);
    }

    private void checkName(String new_name) {
        String URL = "http://20.228.168.55/users/" + user_id + "/displayName";
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("displayName", new_name);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.PUT, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, response);
                TextView name = findViewById(R.id.name);
                name.setText(new_name);
                Toast.makeText(getApplicationContext(), "Name changed successfully!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.w(TAG, error.toString().trim());
                Toast.makeText(getApplicationContext(), "Desired name is taken, please try a different one!", Toast.LENGTH_SHORT).show();
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
}