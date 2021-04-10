import { obj } from "../../types/_types.js";
import { Location } from "../Location.js";
export declare abstract class Address_props extends obj.Obj {
    #private;
    get name(): string;
    set name(name: string);
    get number(): string;
    set number(number: string);
    get address(): string;
    set address(address: string);
    get address2(): string;
    set address2(address: string);
    get zip_code(): string;
    set zip_code(zip: string);
    get city(): string;
    set city(city: string);
    get country(): string;
    set country(country: string);
    get location(): Location;
    set location(location: Location);
    get lat(): number;
    get lng(): number;
}
