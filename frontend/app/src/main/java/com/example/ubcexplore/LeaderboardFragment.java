package com.example.ubcexplore;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.Objects;

public class LeaderboardFragment extends Fragment {
    final static String TAG = "LeaderboardFragment";
    Button globalButton;
    Button friendButton;
    Button join;
    String userId;
    int userScore;

    public LeaderboardFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        userId = ((UserId) requireActivity().getApplication()).getUserId();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_leaderboard, container, false);

        globalButton = view.findViewById(R.id.global_lb_button);
        globalButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), GlobalLeaderboard.class);
                startActivity(intent);
            }
        });
        friendButton = view.findViewById(R.id.friend_lb_button);
        friendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(userId == null || userId == "") {
                    Toast.makeText(getContext(), "Please login to continue!", Toast.LENGTH_SHORT).show();
                }
                else {
                    Intent intent = new Intent(getActivity(), FriendLeaderboard.class);
                    startActivity(intent);
                }
            }
        });
        join = view.findViewById(R.id.join_lb_button);
        join.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(userId == null || userId == "") {
                    Toast.makeText(getContext(), "Please login to continue!", Toast.LENGTH_SHORT).show();
                }
                else {
                    //Upload user's info and achievement
                    //hard code
                    userScore = 20;
                    joinLeaderboard(userId, userScore);
                }
            }
        });
        return view;
    }

    private void joinLeaderboard(String userId,int score){

        RequestQueue requestQueue = Volley.newRequestQueue(requireContext());
        String URL = "http://20.228.168.55/users/"+userId+"/participateInLeaderboard";
        //to participate PUT to 20.228.168.55/users/user_id/participateInLeaderboard
        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("displayName", userId);
            jsonBody.put("score", String.valueOf(score));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.PUT, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                Toast.makeText(getContext(), "You have joined the leaderboard!",
                        Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
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