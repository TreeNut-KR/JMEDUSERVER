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

const token = (obj, auth) => {
  // 알림톡 토큰발행
  if (!obj.body.type || !obj.body.time) {
    return Promise.resolve({ code: 404, message: '토큰 유효기간은 필수입니다.' })
  } else {
    return formParse(obj, auth, `https://kakaoapi.aligo.in/akv10/token/create/${obj.body.time}/${obj.body.type}`)
      .then(postRequest)
      .catch(onError)
  }
}

const friendList = (obj, auth) => {
  // 알림톡 플러스친구리스트
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/profile/list/')
    .then(postRequest)
    .catch(onError)
}

const profileAuth = (obj, auth) => {
  // 알림톡 플러스친구 인증받기
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/profile/auth/')
    .then(postRequest)
    .catch(onError)
}

const profileCategory = (obj, auth) => {
  // 알림톡 플러스친구 프로필 카테고리
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/category/')
    .then(postRequest)
    .catch(onError)
}

const profileAdd = (obj, auth) => {
  // 알림톡 플러스친구등록
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/profile/add/')
    .then(postRequest)
    .catch(onError)
}

const templateList = (obj, auth) => {
  // 알림톡 템플릿리스트
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/template/list/')
    .then(postRequest)
    .catch(onError)
}

const templateAdd = (obj, auth) => {
  // 알림톡 템플릿등록
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/template/add/')
    .then(postRequest)
    .catch(onError)
}

const templateModify = (obj, auth) => {
  // 알림톡 템플릿수정
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/template/modify/')
    .then(postRequest)
    .catch(onError)
}

const templateDel = (obj, auth) => {
  // 알림톡 템플릿삭제
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/template/del/')
    .then(postRequest)
    .catch(onError)
}

const templateRequest = (obj, auth) => {
  // 알림톡 템플릿검수
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/template/request/')
    .then(postRequest)
    .catch(onError)
}

const alimtalkSend = (obj, auth) => {
  // 알림톡 발송
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/alimtalk/send/')
    .then(postRequest)
    .catch(onError)
}

const friendTalkSend = (obj, auth) => {
  // 친구톡 발송
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/friend/send/')
    .then(postRequest)
    .catch(onError)
}

const historyList = (obj, auth) => {
  // 알림톡 발송리스트
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/history/list/')
    .then(postRequest)
    .catch(onError)
}

const historyDetail = (obj, auth) => {
  // 알림톡 발송리스트 상세
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/history/detail/')
    .then(postRequest)
    .catch(onError)
}

const kakaoRemain = (obj, auth) => {
  // 알림톡 발송가능건수
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/heartinfo/')
    .then(postRequest)
    .catch(onError)
}

const kakaoCancel = (obj, auth) => {
  // 알림톡 예약취소
  return formParse(obj, auth, 'https://kakaoapi.aligo.in/akv10/cancel/')
    .then(postRequest)
    .catch(onError)
}


module.exports = {
  send,
  sendMass,
  list,
  smsList,
  remain,
  cancel,
  token,
  friendList,
  profileAuth,
  profileCategory,
  profileAdd,
  templateList,
  templateAdd,
  templateModify,
  templateDel,
  templateRequest,
  friendTalkSend,
  alimtalkSend,
  historyList,
  historyDetail,
  kakaoRemain,
  kakaoCancel
}