package com.example.ubcexplore;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Objects;

public class FriendRequestsActivity extends AppCompatActivity {
    final static String TAG = "FriendRequestsActivity";
    private ArrayList<User> usersList;
    private RecyclerView recyclerView;
    private RecyclerAdapter.RecyclerViewClickListener listener;
    String user_id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_friend_requests);

        usersList = new ArrayList<>();

        Button outgoingRequests = findViewById(R.id.button_outgoing_requests);
        Button incomingRequests = findViewById(R.id.button_incoming_requests);
        recyclerView = findViewById(R.id.recycler_view_incoming_requests);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            user_id = extras.getString("user_id");
        }

        outgoingRequests.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getOutgoingRequests();
            }
        });

        incomingRequests.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getIncomingRequests();
                setAdapter();
                Toast.makeText(getApplicationContext(), "Click on a user to accept or decline the request", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setAdapter() {
        setOnClickListener();
        RecyclerAdapter adapter = new RecyclerAdapter(usersList, listener);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());
        recyclerView.setAdapter(adapter);
    }

    private void setOnClickListener() {
        listener = new RecyclerAdapter.RecyclerViewClickListener() {
            @Override
            public void onClick(View v, int position) {
                if (!Objects.equals(usersList.get(position).getUsername(), "")) {
                    Intent intent = new Intent(getApplicationContext(), ManageRequestsActivity.class);
                    intent.putExtra("user_id", user_id);
                    intent.putExtra("username", usersList.get(position).getUsername());
                    startActivity(intent);
                }
            }
        };
    }

    private void getOutgoingRequests() {
        TextView text_outgoing_requests = findViewById(R.id.text_outgoing_requests);
        text_outgoing_requests.setText("loading...");
        String URL = getString(R.string.ip_address) + "/users/" + user_id;
        StringRequest stringRequest = new StringRequest(URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    String outgoingRequests = jsonResponse.getString("outgoingRequests")
                            .replaceAll("[\\[\\]]", "").replace("\"", "").replace(",", "\n");
                    Log.d(TAG, "outgoingRequests: " + outgoingRequests);
                    text_outgoing_requests.setText(outgoingRequests);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
                Toast.makeText(getApplicationContext(), "Failed", Toast.LENGTH_SHORT).show();
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        requestQueue.add(stringRequest);
    }

    private void getIncomingRequests() {
        String URL = getString(R.string.ip_address) + "/users/" + user_id;
        StringRequest stringRequest = new StringRequest(URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    String incomingRequests = jsonResponse.getString("incomingRequests")
                            .replaceAll("[\\[\\]]", "").replace("\"", "");
                    Log.d(TAG, "incomingRequests: " + incomingRequests);
                    String[] names = incomingRequests.split(",");
                    for (int i = 0; i < names.length; i++) {
                        usersList.clear();
                        usersList.add(new User(names[i]));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
                Toast.makeText(getApplicationContext(), "Failed", Toast.LENGTH_SHORT).show();
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        requestQueue.add(stringRequest);
    }
}