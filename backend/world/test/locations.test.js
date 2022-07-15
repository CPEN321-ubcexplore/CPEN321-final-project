

var location = `{
    "location_name": "Engineering Cairn",
    "coordinate_latitude": 49.262209793949296,
    "coordinate_longitude": -123.25068964753649,
    "fun_facts": "Did you know that Cairn is painted all the time?",
    "related_links": "https://www.instagram.com/theubce/?hl=en",
    "about": "Historical landmark in University Endowment Lands, British Columbia",
    "image_url": "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
    "access_permission": "PUBLIC"
}`;

var location2 = `{
    "location_name": "Walter C. Koerner Library",
    "coordinate_latitude": 49.26666668180186,
    "coordinate_longitude": -123.2551049730976,
    "fun_facts": "Study space: 920 individual carrels, plus rooms for group study, Cost: $24 million dollars",
    "related_links": "https://koerner.library.ubc.ca/koerner-library/about/",
    "about": "Koerner Library is home to the Humanities and Social Sciences at UBC Library, offering a wealth of collections and services to support research, teaching, and learning in these subjects. Koerner is also home to other research services such as the Research Commons and Scholarly Communications and Copyright Office, Borrowing Services, and administrative units.",
    "image_url": "https://wiki.ubc.ca/File:KoernerSpring.jpeg",
    "access_permission": "PUBLIC"
}`;

const addLocation = jest.fn(() => {
    return location;
});
const addLocation2 = jest.fn(() => {
    return location2;
});
const deleteLocation = jest.fn(() => {
    return "Location deleted";
});
const updateLocation = jest.fn(() => {
    return location;
});
const getLocationsByParameters = jest.fn(() => {
    return [location, location2];
});

test("Add locations", function() {

    let result = addLocation();

        expect (result).toBe(location);
});
test("Get location by parameter", function() {
    expect(getLocationsByParameters()).toEqual([location, location2]);
});
test("Update location", function() {
    expect(updateLocation()).toBe(location);
});
test("Delete location", function() {
    expect(deleteLocation()).toBe("Location deleted");
});
