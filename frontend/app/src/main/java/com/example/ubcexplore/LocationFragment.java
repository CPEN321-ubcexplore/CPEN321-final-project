package com.example.ubcexplore;

import static android.R.layout.simple_list_item_1;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

public class LocationFragment extends Fragment {
    ListView locationListView;

    public LocationFragment(){
        // require an empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_location, container, false);

        locationListView = view.findViewById(R.id.list_view_locations);
        getLocationList(view);

        checkLocationPermissions();
        locationListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

            }
        });
        return view;
    }

    private void getLocationList(View view){
        String url = "http://20.228.168.55/locations/";
        RequestQueue requestQueue = Volley.newRequestQueue(getContext());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                String locationList = "";
                /** An example for location
                 * "ID":4,
                 * "coordinate_latitude":49.262209793949296,
                 * "coordinate_longitude":-123.25068964753649,
                 * "location_name":"Engineering Cairn",
                 * "fun_facts":"Did you know that Cairn is painted all the time?",
                 * "related_links":"https://www.instagram.com/theubce/?hl=en",
                 * "about":"Historical landmark in University Endowment Lands, British Columbia",
                 * "image_url":"http://maps.ubc.ca/PROD/images/photos/N044_a.jpg"},
                 */
                locationList = response;
                ServerLocation[] serverLocations;
                serverLocations = new Gson().fromJson(locationList, ServerLocation[].class);
                locationListView = view.findViewById(R.id.list_view_locations);
                ArrayAdapter<ServerLocation> leaderboardAdapter = new ArrayAdapter<ServerLocation>(getContext(), simple_list_item_1, serverLocations);
                locationListView.setAdapter(leaderboardAdapter);
                locationListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        ServerLocation serverLocation = (ServerLocation) parent.getAdapter().getItem(position);
                        Intent intent = new Intent(getContext(),LocationMapActivity.class);
                        intent.putExtra("key", serverLocation);
                        startActivity(intent);
                    }
                });
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getContext(), error.toString().trim(), Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(stringRequest);
    }

    private void checkLocationPermissions(){
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION)==
                PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION)==
                        PackageManager.PERMISSION_GRANTED){

        }
        {
            if (ActivityCompat.shouldShowRequestPermissionRationale(getActivity(),Manifest.permission.ACCESS_COARSE_LOCATION)||
                    ActivityCompat.shouldShowRequestPermissionRationale(getActivity(),Manifest.permission.ACCESS_FINE_LOCATION)){
                Toast.makeText(getContext(),"We need these location permissions to run",
                        Toast.LENGTH_LONG).show();
                new AlertDialog.Builder(getContext())
                        .setTitle("Need location permission")
                        .setMessage("We need the location permission to mark your location on a map")
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                Toast.makeText(getContext(),"We need these location permissions to run",
                                        Toast.LENGTH_LONG).show();
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                                        Manifest.permission.ACCESS_FINE_LOCATION},1);
                            }
                        }).create().show();
            }
            else{
                ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.ACCESS_FINE_LOCATION},1);
            }
        }
    }
}
