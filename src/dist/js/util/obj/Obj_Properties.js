"use strict";

/**
 * To quickly initialize Obj with a Properties class
 */
class Obj_Properties {
  /**
   * Concatenate child props to parent props making an overriding :
   *   If no value in child_props but in parent_props, child_props' remains
   *   child_props' getter (if any) first calls parent_props' getter (if any)
   *   child_props' setter (if any) first calls parent_props' setter (if any)
   * 
   * @param {Obj_Properties} parent_props If wrong, child_props is returned
   * @param {*} child_props If wrong, parent_props is returned
   */
  static concat(parent_props, child_props) {
    //
    // Check preconds
    {
      if(!parent_props || !(parent_props instanceof Obj_Properties)){
        return child_props;
      }

      if(!child_props || !(child_props instanceof Obj_Properties)){
        return parent_props;
      }
    }

    let final_props = parent_props.props;
    const props_c = child_props.props;

    for (const prop in props_p) {
      //
      // Just append the child property
      {
        if (!final_props[prop]) {
          final_props[prop] = props_c[prop];
          continue;
        }
      }

      //
      // Else merge the props : child call the parent
      {
        //
        // Set child value if any
        {
          if (props_c[prop].value) {
            final_props[prop].value = props_c[prop].value;
          }
        }

        //
        // Set getter if any,
        // which calls super getter if any
        {
          if (props_c[prop].get) {
            if (final_props[prop].get) {
              final_props[prop].get = new_getter(final_props[prop].get,
                props_c[prop].get);

              /**
               * Return a function calling first getter1 then getter2
               * @param {*} getter1 
               * @param {*} getter2 
               */
              function new_getter(getter1,getter2){
                return ()=>{
                  getter1();
                  getter2();
                };
              }
            } else {
              final_props[prop].get = props_c[prop].get;
            }
          }
        }

        //
        // Set setter if any,
        // which calls super setter if any
        {
          if (props_c[prop].set) {
            if (final_props[prop].set) {
              final_props[prop].set = new_setter(final_props[prop].set,
                props_c[prop].set);
              
              /**
               * Return a function with 1 argument
               * calling first setter1 then setter2
               * @param {*} setter1 
               * @param {*} setter2 
               */
              function new_setter(setter1,setter2){
                return (value)=>{
                  setter1(value);
                  setter2(value);
                };
              }
            } else {
              final_props[prop].set = props_c[prop].set;
            }
          }
        }
      }
    }

    return {
      static get props(){return final_props;},

      static get lengthes() {
        return {};
      },
    
      static get regex() {
        return {};
      }
    };
  }

  /**
   * {Object}
   */
  static get props() {
    return {
      /*-prop_name: {
        value: prop_value,
        enumerable: true,
        writable: true,
        configurable: true,
      },*/
    };
  }

  static get lengthes() {
    return {};
  }

  static get regex() {
    return {};
  }
}

if (typeof process !== "undefined") {
  module.exports = Obj_Properties;
}
