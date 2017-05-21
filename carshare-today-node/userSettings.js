/**
 * Created by boranyildirim on 21/05/2017.
 */

function saveSettings(id, email, fname, lname, phone_num, age, gender, car_license_plate, bank_account, smokes, chattiness) {

    var update_user = "UPDATE USER SET email = \"" + email + " fname = \"" + fname + "\", lname = \"" + lname + "\", phone_num = \"" + phone_num + "\", age = " + age + "," +
        "gender = \"" + gender + "\", car_license_plate = \"" + car_license_plate + "\", bank_account = \"" + bank_account + "\", smokes = " + smokes + "," +
        "chattiness = " + chattiness + "WHERE ID = " + id;

    return update_user;
}