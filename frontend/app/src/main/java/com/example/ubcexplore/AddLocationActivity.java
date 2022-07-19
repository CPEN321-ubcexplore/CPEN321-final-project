package com.example.ubcexplore;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
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

public class AddLocationActivity extends AppCompatActivity {
    final static String TAG = "AddLocation";
    String user_id;
    int login;
    String name;
    String coords;
    String lat;
    String lon;
    String description;
    String fun_facts;
    String related_links;
    String image_url;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_location);

        user_id = ((UserId) this.getApplication()).getUserId();
        if (user_id == null || user_id.equals("")) {
            login = 0;
        } else {
            login = 1;
        }

        EditText inputName = findViewById(R.id.input_name);
        EditText inputCoords = findViewById(R.id.input_coords);
        EditText inputDescription = findViewById(R.id.input_description);
        EditText inputFunFacts = findViewById(R.id.input_fun_facts);
        EditText inputRelatedLinks = findViewById(R.id.input_related_links);
        EditText inputImage = findViewById(R.id.input_image);

        findViewById(R.id.button_cancel_location).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AddLocationActivity.this.finish();
            }
        });

        findViewById(R.id.button_submit_location).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (login == 0) {
                    Toast.makeText(getApplicationContext(),"Please login first!", Toast.LENGTH_SHORT).show();
                    AddLocationActivity.this.finish();
                }
                else {
                    name = inputName.getText().toString();
                    coords = inputCoords.getText().toString();
                    description = inputDescription.getText().toString();
                    fun_facts = inputFunFacts.getText().toString();
                    related_links = inputRelatedLinks.getText().toString();
                    image_url = inputImage.getText().toString();

                    Log.d(TAG, "name: " + name);

                    if (name.equals("")) {
                        Toast.makeText(getApplicationContext(), "Name cannot be empty!", Toast.LENGTH_SHORT).show();
                    } else if (coords.equals("")) {
                        Toast.makeText(getApplicationContext(), "Coordinates cannot be empty!", Toast.LENGTH_SHORT).show();
                    } else if (description.equals("")) {
                        Toast.makeText(getApplicationContext(), "Description cannot be empty!", Toast.LENGTH_SHORT).show();
                    } else if (fun_facts.equals("")) {
                        Toast.makeText(getApplicationContext(), "Fun facts cannot be empty!", Toast.LENGTH_SHORT).show();
                    } else if (related_links.equals("")) {
                        Toast.makeText(getApplicationContext(), "Related links cannot be empty!", Toast.LENGTH_SHORT).show();
                    } else if (image_url.equals("")) {
                        Toast.makeText(getApplicationContext(), "Image url cannot be empty!", Toast.LENGTH_SHORT).show();
                    } else if (!name.replaceAll(" ", "").matches("[a-zA-Z]+")) {
                        Toast.makeText(getApplicationContext(), "Please only include English alphabets in the name!", Toast.LENGTH_SHORT).show();
                    } else {
                        String[] coordinates = coords.split(",");
                        lat = coordinates[0];
                        lon = coordinates[1];
                        Log.d(TAG, "lat: " + lat + ", lon: " + lon);
                        if (!(lat.matches("[0-9.-]*") && lon.matches("[0-9.-]*"))) {
                            Toast.makeText(getApplicationContext(), "lat and lon can only contain digits and decimal points!", Toast.LENGTH_SHORT).show();
                        } else if (Float.parseFloat(lat) < (float) -90 || Float.parseFloat(lat) > (float) 90) {
                            Toast.makeText(getApplicationContext(), "latitude has to be between -90 and 90!", Toast.LENGTH_SHORT).show();
                        } else if (Float.parseFloat(lon) < (float) -180 || Float.parseFloat(lon) > (float) 180) {
                            Toast.makeText(getApplicationContext(), "longitude has to be between -180 and 180!", Toast.LENGTH_SHORT).show();
                        } else {
                            uploadLocation();
                        }
                    }
                }
            }
        });
    }

    private void uploadLocation() {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String URL = "http://20.228.168.55/locations";
        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("location_name", name);
            jsonBody.put("coordinate_latitude", lat);
            jsonBody.put("coordinate_longitude", lon);
            jsonBody.put("fun_facts", fun_facts);
            jsonBody.put("related_links", related_links);
            jsonBody.put("about", description);
            jsonBody.put("image_url", image_url);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();
        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, "response: " + response);
                Toast.makeText(getApplicationContext(), "Location uploaded successfully!", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, error.toString().trim());
                Toast.makeText(getApplicationContext(), "Upload failed, please retry", Toast.LENGTH_SHORT).show();
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