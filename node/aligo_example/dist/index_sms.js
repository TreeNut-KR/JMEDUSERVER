const fs = require('fs');
const axios = require('axios');
const multiparty = require('multiparty');
const FormData = require('form-data');
// 해당 예제는 axios와 multiparty,form-data를  사용하고있습니다
// npm i request
// npm i multiparty
// npm i form-data

const formParse = (obj, auth, uri) => {
  return new Promise((resolve, reject) => {
    if (obj.headers['content-type'] && obj.headers['content-type'].indexOf('multipart/form-data') !== -1) {
      // content-type이 multipart/form-data일때 multiparty form parse 사용
      let form = new multiparty.Form();
      form.parse(obj, function (err, fields, files) {
        // postData 만들기
        if (err) return reject(new Error(err))
        let postData = {};
        if (files.image) {
          // 파일이 있을경우 postData에 입력
          postData.image = files.image
        }
        if (files.fimage) {
          // 대체문자(이미지)도 입력 *친구톡만 해당
          postData.fimage = files.fimage
        }
        for (let key in auth) {
          // 인증정보
          postData[key] = auth[key]
        }
        for (let key in fields) {
          // 폼데이터
          postData[`${key}`] = fields[key][0]
        }
        postData.uri = uri
        return resolve(postData)
      });
    } else {
      // 그외 (application/json)
      let postData = {};
      for (let key in auth) {
        // 인증정보
        postData[key] = auth[key]
      }
      for (let key in obj.body) {
        // json데이터
        postData[key] = obj.body[key]
      }
      postData.uri = uri
      return resolve(postData)
    }
  });
}

const postRequest = (data) => {
  // request 발송하기
  let uri = data.uri

  let form = new FormData();
  for (let key in data) {
    if (key == 'image' || key == 'fimage') {
      // 파일만 별도로 담아주기
      form.append(key, fs.createReadStream(data[key][0].path), { filename: data[key][0].originalFilename, contentType: data[key][0].headers['content-type'] });
    } else {
      form.append(key, data[key])
    }
  }
  // formData로 변환
  let formHeaders = form.getHeaders();
  return new Promise((resolve, reject) => {
    axios.post(uri, form, {
      headers: {
        ...formHeaders
      }
    })
    .then((res) => {
      return resolve(res.data)
    })
    .catch((err) => {
      return reject(new Error(err.data))
    })
  });
}

const onError = (error) => {
  // 에러처리
  return new Promise((resolve, reject) => {
    return reject(new Error(error))
  });
}

const send = (obj, auth) => {
  // 문자보내기
  return formParse(obj, auth, 'https://apis.aligo.in/send/')
    .then(postRequest)
    .catch(onError)
}

const sendMass = (obj, auth) => {
  // 문자보내기 대량
  return formParse(obj, auth, 'https://apis.aligo.in/send_mass/')
    .then(postRequest)
    .catch(onError)
}

const list = (obj, auth) => {
  // 문자전송결과보기
  return formParse(obj, auth, 'https://apis.aligo.in/list/')
    .then(postRequest)
    .catch(onError)
}

const smsList = (obj, auth) => {
  // 문자전송결과보기 상세
  return formParse(obj, auth, 'https://apis.aligo.in/sms_list/')
    .then(postRequest)
    .catch(onError)
}

const remain = (obj, auth) => {
  // 문자발송가능건수
  return formParse(obj, auth, 'https://apis.aligo.in/remain/')
    .then(postRequest)
    .catch(onError)
}

const cancel = (obj, auth) => {
  // 문자예약취소
  return formParse(obj, auth, 'https://apis.aligo.in/cancel/')
    .then(postRequest)
    .catch(onError)
}

module.exports = {
  send,
  sendMass,
  list,
  smsList,
  remain,
  cancel
}