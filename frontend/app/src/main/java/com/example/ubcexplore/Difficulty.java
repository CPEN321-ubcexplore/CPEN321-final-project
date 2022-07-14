package com.example.ubcexplore;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
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

public class Difficulty extends AppCompatActivity {
    final static String TAG = "Difficulty";
    RadioGroup radioGroup;
    RadioButton radioButton;
    TextView textView;
    Button buttonOK;
    int radioId;
    public String difficulty;
    String user_id;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_difficulty);

        radioGroup = findViewById(R.id.radioGroup);
        textView = findViewById(R.id.text_selected);

        buttonOK= findViewById(R.id.button_OK);
        buttonOK.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                radioId = radioGroup.getCheckedRadioButtonId();
                radioButton = findViewById(radioId);
                difficulty=radioButton.getText().toString();
                textView.setText("Your choice is : " + difficulty+" Mode");

                user_id = ((UserId) getApplication()).getUserId();
                changeDifficulty(user_id, difficulty);
            }
        });
    }

    public void checkButton(View v) {
        int radioId = radioGroup.getCheckedRadioButtonId();

        radioButton = findViewById(radioId);

        Toast.makeText(this, "You've Selected: " + radioButton.getText(),
                Toast.LENGTH_SHORT).show();
    }
    public void changeDifficulty(String user_id, String dif_level) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String URL = "http://20.228.168.55/users/" + user_id + "/difficulty";
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("difficulty", dif_level);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.PUT, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, error.toString().trim());
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





