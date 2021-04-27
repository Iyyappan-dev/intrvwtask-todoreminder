const crypto = require('crypto');

exports.encrypt = function (unencrypted_data) {
	var encrypt_key = crypto.createCipher('aes-128-cbc', '@to-do++');
	var encrypted_data = encrypt_key.update(unencrypted_data, 'utf8', 'hex')
	encrypted_data += encrypt_key.final('hex');
	//console.log(unencrypted_data + ' IS: ' + encrypted_data);
	return encrypted_data;
}

exports.decrypt = function (encrypted_data) {
	var decrypt_key = crypto.createDecipher('aes-128-cbc', '@to-do++');
	var decrypted_data = decrypt_key.update(encrypted_data, 'hex', 'utf8')
	decrypted_data += decrypt_key.final('utf8');
	//console.log(encrypted_data + ' IS: ' + decrypted_data);
	return decrypted_data;
}

