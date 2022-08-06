package com.example.ubcexplore;

import static android.R.layout.simple_list_item_1;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.FragmentActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.ubcexplore.databinding.ActivityLocationMapBinding;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class LocationMapActivity extends FragmentActivity implements OnMapReadyCallback {
    private GoogleMap map;
    ServerLocation destServerLocation;
    Location currLoc = new Location("provider");
    private final int LOC_CHANGE_THRESHOLD = 5;
    Button buttonCancel;
    Button buttonShowImage;
    ImageView image;
    boolean difficulty = false; // true = easy; false = medium
    int offsetLat = ThreadLocalRandom.current().nextInt(-40, 41);
    int offsetLon = ThreadLocalRandom.current().nextInt(-40, 41);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ActivityLocationMapBinding binding = ActivityLocationMapBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            destServerLocation = (ServerLocation) getIntent().getSerializableExtra("key");
        }

        buttonCancel = (Button) findViewById(R.id.button_map_cancel);
        buttonCancel.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                finish();
            }
        });

        getDifficulty();

        ImageView image = (ImageView) findViewById(R.id.url_image);
        image.setVisibility(View.INVISIBLE);
        String imageUrl = destServerLocation.image();
        Picasso.get().load(imageUrl).into(image);

        buttonShowImage = (Button) findViewById(R.id.button_map_show_image);
        buttonShowImage.setVisibility(View.INVISIBLE);
        buttonShowImage.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if(image.getVisibility() == View.INVISIBLE)
                    image.setVisibility(View.VISIBLE);
                else
                    image.setVisibility(View.INVISIBLE);
            }
        });

    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        map = googleMap;

        LatLng destLatLng = new LatLng(destServerLocation.lat(), destServerLocation.lon());
        Location destLoc = new Location(LocationManager.GPS_PROVIDER);
        destLoc.setLatitude(destServerLocation.lat());
        destLoc.setLongitude(destServerLocation.lon());
        CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(destLatLng, 14);
        map.animateCamera(cameraUpdate);
        currLoc.setLatitude(0);
        currLoc.setLongitude(0);
        final boolean[] arrived = {false};
        // Get current location
        LocationManager locManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        locManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        locManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, new LocationListener(){
            @Override
            public void onLocationChanged(Location newLoc) {
                if(currLoc.distanceTo(destLoc) < 10 && !arrived[0]) {
                    arrived[0] = true;
                    String message = "You have reached " + destServerLocation.name();
                    message += ", " + destServerLocation.about();
                    if(!message.trim().endsWith(".")){message += ".";}
                    message += "\n\n" + destServerLocation.funFacts();
                    AlertDialog.Builder builder = new AlertDialog.Builder(LocationMapActivity.this);
                    builder.setMessage(message)
                            .setPositiveButton("Go back", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    finish();
                                }
                            })
                            .create().show();
                }
                if(currLoc.distanceTo(newLoc) > LOC_CHANGE_THRESHOLD) {
                    map.clear();
                    map.addMarker(new MarkerOptions().position(new LatLng(newLoc.getLatitude(), newLoc.getLongitude())).title("Current Location"));
                    if(difficulty) {
                        buttonShowImage.setVisibility(View.INVISIBLE);
                        map.addMarker(new MarkerOptions().position(destLatLng).title(destServerLocation.name()));
                        drawDirections(new LatLng(newLoc.getLatitude(), newLoc.getLongitude()), destLatLng);
                    }
                    else {
                        buttonShowImage.setVisibility(View.VISIBLE);
                        map.addCircle(new CircleOptions()
                                .center(new LatLng(destLatLng.latitude+1.0*offsetLat/111111, destLatLng.longitude+1.0*offsetLon/111111))
                                .radius(60)
                                .strokeColor(Color.RED)
                                .fillColor(Color.TRANSPARENT));
                    }
                    currLoc.set(newLoc);
                }}
        });
    }

    private void drawDirections(LatLng origin, LatLng dest) {

        String url = getDirectionsUrl(origin, dest);

        DownloadTask downloadTask = new DownloadTask();

        // Start downloading json data from Google Directions API
        downloadTask.execute(url);
    }


    private String getDirectionsUrl(LatLng origin, LatLng dest) {


        // Origin of route
        String str_origin = "origin=" + origin.latitude + "," + origin.longitude;

        // Destination of route
        String str_dest = "destination=" + dest.latitude + "," + dest.longitude;

        // Building the parameters to the web service
        String parameters = str_origin + "&" + str_dest + "&key=" + getString(R.string.apiKey);

        // Output format
        String output = "json";

        // Building the url to the web service
        String url = "https://maps.googleapis.com/maps/api/directions/" + output + "?" + parameters;

        return url;
    }

    /**
     * A method to download json data from url
     */
    private String downloadUrl(String strUrl) throws IOException {
        String data = "";
        InputStream iStream = null;
        HttpURLConnection urlConnection = null;
        try {
            URL url = new URL(strUrl);

            // Creating an http connection to communicate with url
            urlConnection = (HttpURLConnection) url.openConnection();

            // Connecting to url
            urlConnection.connect();

            // Reading data from url
            iStream = urlConnection.getInputStream();

            BufferedReader br = new BufferedReader(new InputStreamReader(iStream));

            StringBuffer sb = new StringBuffer();

            String line = "";
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            data = sb.toString();

            br.close();

        } catch (Exception e) {
            Log.d("Exception while downloa", e.toString());
        } finally {
            iStream.close();
            urlConnection.disconnect();
        }
        return data;
    }

    // Fetches data from url passed
    private class DownloadTask extends AsyncTask<String, Void, String> {

        // Downloading data in non-ui thread
        @Override
        protected String doInBackground(String... url) {

            // For storing data from web service
            String data = "";

            try {
                // Fetching the data from web service
                data = downloadUrl(url[0]);
            } catch (Exception e) {
                Log.d("Background Task", e.toString());
            }
            return data;
        }

        // Executes in UI thread, after the execution of
        // doInBackground()
        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            ParserTask parserTask = new ParserTask();

            // Invokes the thread for parsing the JSON data
            parserTask.execute(result);
        }
    }

    /**
     * A class to parse the Google Places in JSON format
     */
    private class ParserTask extends AsyncTask<String, Integer, List<List<HashMap<String, String>>>> {

        // Parsing the data in non-ui thread
        @Override
        protected List<List<HashMap<String, String>>> doInBackground(String... jsonData) {

            JSONObject jObject;
            List<List<HashMap<String, String>>> routes = null;

            try {
                jObject = new JSONObject(jsonData[0]);
                DirectionsJSONParser parser = new DirectionsJSONParser();

                // Starts parsing data
                routes = parser.parse(jObject);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return routes;
        }

        // Executes in UI thread, after the parsing process
        @Override
        protected void onPostExecute(List<List<HashMap<String, String>>> result) {
            ArrayList<LatLng> points = null;
            PolylineOptions lineOptions = null;

            if (result == null) {
                return;
            } else if (result.size() < 1) {
                Toast.makeText(getBaseContext(), "No Points", Toast.LENGTH_SHORT).show();
                return;
            }

            // Traversing through all the routes
            for (int i = 0; i < result.size(); i++) {
                points = new ArrayList<LatLng>();
                lineOptions = new PolylineOptions();

                // Fetching i-th route
                List<HashMap<String, String>> path = result.get(i);

                // Fetching all the points in i-th route
                for (int j = 0; j < path.size(); j++) {
                    HashMap<String, String> point = path.get(j);

                    if (j == 0) {    // Get distance from the list
                        point.get("distance");
                        continue;
                    } else if (j == 1) { // Get duration from the list
                        point.get("duration");
                        continue;
                    }

                    double lat = Double.parseDouble(point.get("lat"));
                    double lng = Double.parseDouble(point.get("lng"));
                    LatLng position = new LatLng(lat, lng);

                    points.add(position);
                }

                // Adding all the points in the route to LineOptions
                lineOptions.addAll(points);
                lineOptions.width(5);
                lineOptions.color(Color.RED);
            }


            // Drawing polyline in the Google Map for the i-th route
            map.addPolyline(lineOptions);
        }
    }
    private void getDifficulty(){
        String url = getString(R.string.ip_address) + "/users/"+((UserId) getApplication()).getUserId();
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                ServerDifficulty serverDifficulty;
                serverDifficulty  = new Gson().fromJson(response, ServerDifficulty.class);
                if(serverDifficulty.getDifficulty().equals("Easy")){
                    difficulty=true;
                }else{
                    difficulty=false;
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(stringRequest);
    }
}