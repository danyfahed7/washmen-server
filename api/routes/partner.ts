import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";

class Partner {

    public express: express.Application;
    public logger: Logger;

    // array to hold partners in range
    public partners: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.partners = [];
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        // request to get all the partners in the specified range
        this.express.get("/partners/:range&:root", (req, res, next) => {
            this.partners = []
            var partnersInRange = []
            const { greatCircleDistance } = require("great-circle-distance");
            const fs = require('fs');

            //get parameters sent in the request
            var range = Number(req.params.range);
            var root = req.params.root;

            // read partners json
            let rawdata = fs.readFileSync('./data/partners.json');
            let partners = JSON.parse(rawdata);

            //loop on the partners
            for (var i = 0; i < partners.length; i++){        
                var offices = partners[i]["offices"];
                //loop on the offices of this partner
                for (var j = 0; j < offices.length; j++){
                    //clone the partner, to search for the partner based on each address
                    //if we want in the future to search for the unique partners, then we can change it
                    var partnerInRange = JSON.parse(JSON.stringify(partners[i]));
                    //get coordinates of this office
                    var coordinates = offices[j]["coordinates"]
                    const lat2 = coordinates.split(",")[0]
                    const lng2 = coordinates.split(",")[1]
                    const coords = {
                        lat1: root.split(',')[0],
                        lng1: root.split(',')[1],
                        lat2: lat2,
                        lng2: lng2
                    };
                    //get the great circle distance between the root and this office
                    var distance = greatCircleDistance(coords);        
                    
                    if(distance <= range){   
                        //if distance in the range selected, then add it to the array of partners in range
                        //we add some extra fields in the partner in range object so we can easily display it on the map
                        partnerInRange.distance = distance;
                        partnerInRange.addressInRange = offices[j]["address"]  
                        partnerInRange.lat = lat2 
                        partnerInRange.lng = lng2                                  
                        partnersInRange.push(partnerInRange);
                    }
                }           
            }
            //sort the array of partners in range based on the name of the partner, order ascending
            partnersInRange.sort(function (a, b) {
                return a.organization.localeCompare(b.organization);
            });
            this.partners = partnersInRange;
            res.json(this.partners);
        });
    }
}

export default new Partner().express;