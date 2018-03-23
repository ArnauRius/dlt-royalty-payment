export default class Model {

    serialize(){
        throw new Error('You have to add the serialize method in the class');
    }
    static deserialize(serialized){
        throw new Error('You have to add the deserialize method in the class');
    }


}