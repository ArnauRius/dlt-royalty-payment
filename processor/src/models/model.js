/* This class represents is abstraction for all the Models */

export default class Model {

    /**
     * Serializes the whole Model information to a string, using some Model's specific
     * pattern
     */
    serialize(){
        throw new Error('Abstract: serialize() method must be implemented in childs');
    }

    /**
     * Static method that, given a serialized version of the Model, deserializes it, inverting the
     * pattern used for serialization and returns a new Model instance using the information of
     * the serialized version
     * @param serialized - The serialized Model version
     * @returns {Model} - The new Model instance
     */
    static deserialize(serialized){
        throw new Error('Abstract: deserialize() method must be implemented in childs');
    }


}