package com.example.ubcexplore;

import java.io.Serializable;

public class ServerLocation implements Serializable {
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
    private float coordinate_latitude;
    private float coordinate_longitude;
    private String location_name;
    private String fun_facts;
    private String related_links;
    private String about;
    private String image_url;
    private String access_permission;

    @Override
    public String toString(){
        if(access_permission.equals("PUBLIC")) {
            return location_name;
        }
        else {
            return "[secret location]";
        }
    }
    public float lat(){
        return coordinate_latitude;
    }
    public float lon(){
        return coordinate_longitude;
    }
    public String name(){
        return location_name;
    }
    public String funFacts(){
        return fun_facts;
    }
    public String link(){
        return related_links;
    }
    public String about(){
        return about;
    }
    public String image(){
        return image_url;
    }
}
