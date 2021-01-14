/* 
  		This javascript library is used to convert zip compressed data 
                (de-/inflated by pako.js) to base64 strings and vice versa.
		It has been developed mostly for educational use.
		Copyright (C) 2020 T. Roller 
		E-Mail: myLastName@posteo.de
		Version: 1.0 (13. Jan. 2021)

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU Affero General Public License as
		published by the Free Software Foundation, either version 3 of the
		License, or (at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU Affero General Public License for more details.

		You should have received a copy of the GNU Affero General Public License
		along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const b64lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function textZToB64(text) {
    // zip-compress a text and base64-encode it
    return arrayToB64(pako.deflate(text));
}

function b64ToUzText(b64str) {
    // base64 decode and unzip text
    td = new TextDecoder();
    return td.decode(pako.inflate(b64ToArray(b64str)));
    
}

function arrayToB64 (original) {
    // convert a Uint8Array to a base64-String
    var paddedLength = Math.ceil(original.length / 3)*3; // pad length to next divisible by 3
    var pad = paddedLength-original.length; // number of bytes added
    var paddedOriginal = new Uint8Array(paddedLength);	
    paddedOriginal.set(original); //same as original, but with additional 0-Bytes 
    var b64str = "" ;
    for (byet = 0; byet < paddedLength; byet += 3) {
        // always pick three bytes and cut them to 64-bit-chunks
	var threeBytes = paddedOriginal.subarray(byet, byet+3);
	b64str += b64lookup.charAt(threeBytes[0] >> 2);
	b64str += b64lookup.charAt(((threeBytes[0] & 3 ) << 4) + (threeBytes[1] >> 4));
	b64str += b64lookup.charAt(((threeBytes[1] & 15) << 2) + (threeBytes[2] >> 6));
	b64str += b64lookup.charAt(threeBytes[2] & 63);
    }
    return b64str.substr(0, b64str.length-pad) + "=".repeat(pad);
}

function b64ToArray (b64str) {
    // convert a base64-String to Uint8Array
    var b64array = new Uint8Array(b64str.length);
    var paddedOriginal = [];
    var pad = 0; // length of padding (count of "=" at the end of b64str)
    for (i = 0; i< b64str.length; i++) {
        if (b64str[i] == "=") {
            b64array[i] = 0;
            pad++;
        } else {
            b64array[i] = b64lookup.indexOf(b64str[i]);
        }
    }
    for (i = 0; i < b64str.length; i+= 4) {
        var fourChunks = b64array.subarray(i, i+4);
        paddedOriginal.push((fourChunks[0] << 2) + (fourChunks[1] >> 4));
        paddedOriginal.push((fourChunks[1] << 4) + (fourChunks[2] >> 2));
        paddedOriginal.push((fourChunks[2] << 6) + (fourChunks[3] ));
        
    }
    return new Uint8Array(paddedOriginal).subarray(0,paddedOriginal.length-pad);
    
}



