package com.example.ubcexplore;

import static android.R.layout.simple_list_item_1;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class GlobalLeaderboard extends AppCompatActivity {
    ListView globalLeaderboardLV;
    private final Socket mSocket = IO.socket("http://20.228.168.55" + ":8082");

    public GlobalLeaderboard() throws URISyntaxException {
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_global_leaderboard);

        getGlobalLeaderBoard();

        mSocket.on("score update", onNewUpdate);
        mSocket.connect();
    }

    private final Emitter.Listener onNewUpdate = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    getGlobalLeaderBoard();
                }
            });
        }
    };

    private void getGlobalLeaderBoard(){
        String url = getString(R.string.ip_address) + "/users/leaderboard";
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                String leaderboard = "";
                // leaderboard = "[{\"displayName\":\"Test3\",\"score\":40},{\"displayName\":\"Test2\",\"score\":10},{\"displayName\":\"Test\",\"score\":5}]";
                leaderboard = response;
                UserInfoLeaderboard[] globalLeaderboard;
                globalLeaderboard  = new Gson().fromJson(leaderboard, UserInfoLeaderboard[].class);
                globalLeaderboardLV = findViewById(R.id.list_view_global);
                ArrayAdapter<UserInfoLeaderboard> leaderboardAdapter = new ArrayAdapter<UserInfoLeaderboard>(GlobalLeaderboard.this, simple_list_item_1, globalLeaderboard);
                globalLeaderboardLV.setAdapter(leaderboardAdapter);
                Toast.makeText(getApplicationContext(), "Global leaderboard loaded successfully!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(stringRequest);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
        mSocket.off("new update", onNewUpdate);
    }
}