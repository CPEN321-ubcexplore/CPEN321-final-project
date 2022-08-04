package com.example.ubcexplore;

import static android.R.layout.simple_list_item_1;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

public class LocationFragment extends Fragment {
    ListView locationListView;
    final static String TAG = "LocationFragment";
    private String unlockedLocations;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_location, container, false);

        locationListView = view.findViewById(R.id.list_view_locations);
        getLocationList(view);

        checkLocationPermissions();
        return view;
    }

    private void getUnlockedLocations(){
        String userId = ((UserId) requireActivity().getApplication()).getUserId();
        if (!(userId == null || userId.equals(""))) {
            String URL = getString(R.string.ip_address) + "/users/" + userId;
            StringRequest stringRequest = new StringRequest(URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        JSONObject jsonObject = new JSONObject(response);
                        unlockedLocations = jsonObject.getString("unlockedLocations");
                        Log.d(TAG, unlockedLocations);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG, error.toString().trim());
                }
            });
            RequestQueue requestQueue = Volley.newRequestQueue(this.requireContext());
            requestQueue.add(stringRequest);
        }
    }

    private void getLocationList(View view){
        getUnlockedLocations();

        String url = getString(R.string.ip_address) + "/locations/";
        RequestQueue requestQueue = Volley.newRequestQueue(requireContext());
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

                        if(serverLocation.toString().equals("[secret location]")) {
                            if(unlockedLocations != null) {
                                unlockedLocations = unlockedLocations
                                        .replaceAll("\"","")
                                        .replaceAll("\\[","")
                                        .replaceAll("]","");
                                List<String> unlockedLocationsList = Arrays.asList(unlockedLocations.split(","));
                                Log.d(TAG, "unlockedLocation: " + unlockedLocationsList.get(0));
                                if(unlockedLocationsList.get(0).equals(serverLocation.name())){
                                    alertGoToLocation(serverLocation);
                                } else {
                                    alertGoToPuzzles();
                                }
                            } else {
                                alertGoToPuzzles();
                            }
                        }
                        else {
                            alertGoToLocation(serverLocation);
                        }
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

    private void alertGoToLocation(ServerLocation serverLocation){
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setMessage("Are you sure you want to visit the " + serverLocation.name() + "?")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        Intent intent = new Intent(getContext(), LocationMapActivity.class);
                        intent.putExtra("key", serverLocation);
                        startActivity(intent);
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                    }
                })
                .create().show();
    }

    private void alertGoToPuzzles(){
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setMessage("Find puzzles to unlock the secret location! (Make sure you are logged in)")
                .setNegativeButton("Ok", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                    }
                })
                .create().show();
    }

    private void checkLocationPermissions(){
        if (!(ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION)==
                PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)==
                        PackageManager.PERMISSION_GRANTED)) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(), Manifest.permission.ACCESS_COARSE_LOCATION) ||
                    ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(), Manifest.permission.ACCESS_FINE_LOCATION)) {
                Toast.makeText(getContext(), "We need these location permissions to run",
                        Toast.LENGTH_LONG).show();
                new AlertDialog.Builder(getContext())
                        .setTitle("Need location permission")
                        .setMessage("We need the location permission to run")
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                Toast.makeText(getContext(), "We need these location permissions to run",
                                        Toast.LENGTH_LONG).show();
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ActivityCompat.requestPermissions(requireActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                                        Manifest.permission.ACCESS_FINE_LOCATION}, 1);
                            }
                        }).create().show();
            } else {
                ActivityCompat.requestPermissions(requireActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }
}