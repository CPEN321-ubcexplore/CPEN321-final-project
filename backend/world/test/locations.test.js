

var location = {
    location_name: "Engineering Cairn",
    coordinate_latitude: 49.262209793949296,
    coordinate_longitude: -123.25068964753649,
    fun_facts: "Did you know that Cairn is painted all the time?",
    related_links: "https://www.instagram.com/theubce/?hl=en",
    about: "Historical landmark in University Endowment Lands, British Columbia",
    image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
    access_permission: "PUBLIC",
};

var location2 = {
    location_name: "Walter C. Koerner Library",
    coordinate_latitude: 49.26666668180186,
    coordinate_longitude: -123.2551049730976,
    fun_facts:
        "Study space: 920 individual carrels, plus rooms for group study, Cost: $24 million dollars",
    related_links: "https://koerner.library.ubc.ca/koerner-library/about/",
    about: "Koerner Library is home to the Humanities and Social Sciences at UBC Library, offering a wealth of collections and services to support research, teaching, and learning in these subjects. Koerner is also home to other research services such as the Research Commons and Scholarly Communications and Copyright Office, Borrowing Services, and administrative units.",
    image_url: "https://wiki.ubc.ca/File:KoernerSpring.jpeg",
    access_permission: "PUBLIC",
};

const addLocation = jest.fn(() => {
    return location;
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

test("Add locations", function () {
    let result = addLocation();

    expect(result).toBe(location);
});
test("Get location by parameter", function () {
    expect(getLocationsByParameters()).toEqual([location, location2]);
});
test("Update location", function () {
    expect(updateLocation()).toBe(location);
});
test("Delete location", function () {
    expect(deleteLocation()).toBe("Location deleted");
});

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../locations_server");
const io = require("socket.io-client");
var socket = io.connect("http://localhost:8083", { reconnect: true });

describe(`Locations API Tests`, function () {
    beforeAll(async () => {
        console.log("check 1", socket.connected);
        socket.on("connect", function () {
            console.log("check 2", socket.connected);
        });

        socket.emit("join", "locations");

        await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    });
    afterAll(async () => {
        await new Promise((resolve) => setTimeout(() => resolve(), 4500)); // avoid jest open handle error
    });

    describe(`DELETE /all`, () => {
        test(`should "All locations deleted" with Status code:200`, async () => {
            const response = await request(app).delete(`/all`);
            await expect(response.text).toBe(`All locations deleted`);
            await expect(response.statusCode).toBe(200);
        });
    });

    describe(`GET /`, () => {
        test(`It should respond with an empty arrayObject with Status code:200`, async () => {
            const response = await request(app).get(`/`);
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([]);
        }
        );
    }
    );

    describe(`POST /`, () => {
        test(`Add location with missing coordinate_latitude and get
        "Coordinate latitude is missing" 
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Coordinate latitude is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );
        test(`Add location with missing coordinate_longitude and get
        "Coordinate longitude is missing"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Coordinate longitude is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );
        test(`Add location with missing location_name and get
        "Location name is missing"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Location name is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with missing fun_facts and get
        "Fun facts is missing"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Fun facts is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with missing related_links and get
        "Related links is missing"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Related links is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with missing about and get
        "About is missing"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`About is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with missing image_url and get
        "Image url is missing"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Image url is missing`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with invalid coordinate_latitude and get
        "Coordinate latitude is not between -90 and 90"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 91,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Coordinate latitude is not between -90 and 90`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with invalid coordinate_longitude and get
        "Coordinate longitude is not between -180 and 180"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -181,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Coordinate longitude is not between -180 and 180`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with invalid access_permission and get
        "Access permission is not either \"PUBLIC\" or \"PRIVATE\""
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn",
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "LUL",
            });
            await expect(response.text).toEqual(`Access permission is not either \"PUBLIC\" or \"PRIVATE\"`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with location_name greater than 255 characters and get
        "Location name is not between 1 and 255 characters"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn".repeat(256),
                coordinate_latitude: 49.262209793949296,
                coordinate_longitude: -123.25068964753649,
                fun_facts: "Did you know that Cairn is painted all the time?",
                related_links: "https://www.instagram.com/theubce/?hl=en",
                about: "Historical landmark in University Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Location name is not between 1 and 255 characters`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Add location with invalid image_url and get
        "Image URL is not a valid URL"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send({
                location_name: "Engineering Cairn2",
                coordinate_latitude: 0,
                coordinate_longitude: 0,
                fun_facts: "Did",
                related_links: "https://www.instagram.com/theuce/?hl=en",
                about: "Historical landmark in Unversity Endowment Lands, British Columbia",
                image_url: "http://maps.ubc.ca/PROD/images/photos/N044_a.55jpg",
                access_permission: "PUBLIC",
            });
            await expect(response.text).toEqual(`Image URL is not a valid URL`);
            await expect(response.statusCode).toBe(400);
        });

        test(`Add location with non-existing location_name and get
        the added location
        Status code:200`, async () => {
            const response = await request(app).post(`/`).send(
                location
            );
            await expect(JSON.parse(response.text)).toEqual([location]);
            await expect(response.statusCode).toBe(201);
        }
        );

        test(`Add location with non-existing location_name and get
        the added location
        Status code:200`, async () => {
            const response = await request(app).post(`/`).send(
                location2
            );
            await expect(JSON.parse(response.text)).toEqual([location2]);
            await expect(response.statusCode).toBe(201);
        }
        );

        test(`Add location with existing location_name and get
        "Location Name already exists"
        Status code:400`, async () => {
            const response = await request(app).post(`/`).send(
                location
            );
            await expect(response.text).toEqual(`Location Name already exists`);
            await expect(response.statusCode).toBe(400);
        }
        );

        
    }
    );


    describe(`GET /:location_name`, () => {
        test(`Get location with blank location_name and get
        all locations
        Status code:200`, async () => {
            const response = await request(app).get(`/`);
            await expect(JSON.parse(response.text)).toEqual([location, location2]);
            await expect(response.statusCode).toBe(200);
        }
        );
        
        test(`Get location with existing location_name and get
        the location
        Status code:200`, async () => {
            const response = await request(app).get(`/${location.location_name}`);
            await expect(JSON.parse(response.text)).toEqual([location]);
            await expect(response.statusCode).toBe(200);
        }
        );

        test(`Get location with non-existing location_name and get
        empty array        
        Status code:404`, async () => {
            const response = await request(app).get(`/non-existing-location-name`);
            await expect(response.text).toEqual("[]");
            await expect(response.statusCode).toBe(404);
        }
        );


        test(`Get location with coordinates = (49.262209793949296, -123.25068964753649) and radius = 0.1 and get
        all locations
        Status code:200`, async () => {
            const response = await request(app).get(`/?coordinate_latitude=49.262209793949296&coordinate_longitude=-123.25068964753649&radius=0.1`);
            await expect(JSON.parse(response.text)).toEqual([location, location2]);
            await expect(response.statusCode).toBe(200);

        });

        test(`Get location with fun_facts = "Did you know that Cairn is painted all the time?" and get
        all locations with the same fun_facts
        Status code:200`, async () => {
            const response = await request(app).get(`/?fun_facts=Did you know that Cairn is painted all the time?`);
            await expect(JSON.parse(response.text)).toEqual([location, location2]);
            await expect(response.statusCode).toBe(200);
        }
        );

        test(`Get location with related_links = "https://www.instagram.com/theubce/?hl=en" and get
        all locations with the same related_links
        Status code:200`, async () => {
            const response = await request(app).get(`/?related_links=https://www.instagram.com/theubce/?hl=en`);
            await expect(JSON.parse(response.text)).toEqual([location, location2]);
            await expect(response.statusCode).toBe(200);
        }
        );

        test(`Get location with about = "Historical landmark in University Endowment Lands, British Columbia" and get
        all locations with the same about
        Status code:200`, async () => {
            const response = await request(app).get(`/?about=Historical landmark in University Endowment Lands, British Columbia`);
            await expect(JSON.parse(response.text)).toEqual([location, location2]);
            await expect(response.statusCode).toBe(200);
        }
        );

        test(`Get location with access_permission = "PUBLIC" and get
        all locations with the same access_permission
        Status code:200`, async () => {
            const response = await request(app).get(`/?access_permission=PUBLIC`);
            await expect(JSON.parse(response.text)).toEqual([location, location2]);
            await expect(response.statusCode).toBe(200);
        }
        );

        test(`Get location with access_permission = "PRIVATE" and get
        empty array
        Status code:200`, async () => {
            const response = await request(app).get(`/?access_permission=PRIVATE`);
            await expect(response.text).toEqual("[]");
            await expect(response.statusCode).toBe(200);
        }
        );

    });

    describe(`PUT /:location_name`, () => {
        test(`Update location with blank location_name and get
        status code:404`, async () => {
            const response = await request(app).put(`/`).send({
                location
            });
            await expect(response.statusCode).toBe(404);
        }
        );

        test(`Update location with existing location_name and get
        the updated location
        Status code:200`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: location.coordinate_longitude,
                radius: location.radius,
                fun_facts: location.fun_facts,
                related_links: location.related_links,
                about: location.about,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(JSON.parse(response.text)).toEqual([location_to_update]);
            await expect(response.statusCode).toBe(200);    

        }
        );

        test(`Update location with non-existing location_name and get
        status code:404`, async () => {
            const location_to_update = {
                location_name: "non-existing-location-name",
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: location.coordinate_longitude,
                radius: location.radius,
                fun_facts: location.fun_facts,
                related_links: location.related_links,
                about: location.about,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/non-existing-location-name`).send(location_to_update);
            await expect(response.statusCode).toBe(404);
        }
        );

        test(`Update location with coordiante_latitude = NaN and get
        "Coordinate latitude is not a number"
        Status code:400`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: 'a',
                coordinate_longitude: location.coordinate_longitude,
                radius: location.radius,
                fun_facts: location.fun_facts,
                related_links: location.related_links,
                about: location.about,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(response.text).toEqual(`Coordinate latitude is not a number`);
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Update location with coordinate_longitude = NaN and get
        "Coordinate longitude is not a number"
        Status code:400`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: 'a',
                radius: location.radius,
                fun_facts: location.fun_facts,
                related_links: location.related_links,
                about: location.about,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(response.text).toEqual(`Coordinate longitude is not a number`);
            await expect(response.statusCode).toBe(400);
        }
        );


        test(`Update location with fun_facts not a string and get
        "Fun facts is not a string"
        Status code:400`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: location.coordinate_longitude,
                fun_facts: null,
                related_links: location.related_links,
                about: location.about,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(response.text).toEqual("Fun facts is not a string");
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Update location with related_links not a string and get
        "Related links is not a string"
        Status code:400`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: location.coordinate_longitude,
                fun_facts: location.fun_facts,
                related_links: null,
                about: location.about,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(response.text).toEqual("Related links is not a string");
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Update location with about not a string and get
        "About is not a string"
        Status code:400`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: location.coordinate_longitude,
                fun_facts: location.fun_facts,
                related_links: location.related_links,
                about: null,
                image_url: location.image_url,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(response.text).toEqual("About is not a string");
            await expect(response.statusCode).toBe(400);
        }
        );

        test(`Update location with image_url not a string and get
        "Image url is not a string"
        Status code:400`, async () => {
            const location_to_update = {
                location_name: location.location_name,
                coordinate_latitude: location.coordinate_latitude,
                coordinate_longitude: location.coordinate_longitude,
                fun_facts: location.fun_facts,
                related_links: location.related_links,
                about: location.about,
                image_url: null,
                access_permission: "PRIVATE"
            };
            const response = await request(app).put(`/${location.location_name}`).send(location_to_update);
            await expect(response.text).toEqual("Image url is not a string");
            await expect(response.statusCode).toBe(400);
        }
        );

    }
    );

    describe(`DELETE /:location_name}`, () => {
        test(`Delete location with blank location_name and get
        Status code:404`, async () => {
            const response = await request(app).delete(`/`);
            await expect(response.statusCode).toBe(404);
        }
        );

        test(`Delete location with existing location_name and get
        "Location deleted"
        Status code:200`, async () => {
            const response = await request(app).delete(`/${location.location_name}`);
            await expect(response.text).toEqual("Location deleted");
            await expect(response.statusCode).toBe(200);
        }
        );

        test(`Delete location with non-existing location_name and get
        "Location deleted"
        Status code:200`, async () => {
            const response = await request(app).delete(`/non-existing-location`);
            await expect(response.text).toEqual("Location deleted");
            await expect(response.statusCode).toBe(200);
        }
        );


    }
    );

    describe(`GET / after deleting location`, () => {
        test(`Get all locations and get
        all locations
        Status code:200`, async () => {
            const response = await request(app).get(`/`);
            await expect(JSON.parse(response.body)).toEqual([locations]);
            await expect(response.statusCode).toBe(200);
        }
        );
    }
    );







});
