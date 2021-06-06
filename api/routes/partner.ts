import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";

class Partner {

    public express: express.Application;
    public logger: Logger;

    // array to hold partners
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
            var range = Number(req.params.range);
            var root = req.params.root;
            const fs = require('fs');

            let rawdata = fs.readFileSync('./data/partners.json');
            let partners = JSON.parse(rawdata);            
            
            for (var i = 0; i < partners.length; i++){
                var partner = partners[i];
                
                for (var key in partner){
                    var value = partner[key];                  
                    var offices = partner["offices"];
                    if(key=="offices"){
                        for (var j = 0; j < offices.length; j++){
                            var office = offices[j];       
                            for (var key2 in office){
                                var value2 = office[key2];
                                var coordinates = office["coordinates"]
                                var partnerInRange = JSON.parse(JSON.stringify(partner));
                                if(key2=="coordinates"){
                                    const lat2 = coordinates.split(",")[0]
                                    const lng2 = coordinates.split(",")[1]
                                    const coords = {
                                        lat1: root.split(',')[0],
                                        lng1: root.split(',')[1],
                                        lat2: lat2,
                                        lng2: lng2
                                    };
                                    var distance = greatCircleDistance(coords);
                                    var addressInRange = office["address"] ;        
                                    
                                    if(distance <= range){   
                                        partnerInRange.distance = distance;
                                        partnerInRange.addressInRange = addressInRange  
                                        partnerInRange.lat = lat2 
                                        partnerInRange.lng = lng2                                  
                                        partnersInRange.push(partnerInRange);
                                    }
                                }
                            }
                        }
                    }
                    
                }                
            }

            partnersInRange.sort(function (a, b) {
                return a.organization.localeCompare(b.organization);
            });
            this.partners = partnersInRange;
            res.json(this.partners);
        });

        // request to get all the partners in the specified range
        this.express.get("/partners/", (req, res, next) => {
            // this.logger.info("url:::::" + req.url);
            const partner = this.partners.filter(function (partner) {
                console.log(1)
                // if (req.params.userName === user.userName) {
                //     return user;
                // }
            });
            res.json(partner);
        });

    }
}

export default new Partner().express;