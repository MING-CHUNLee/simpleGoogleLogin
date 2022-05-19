/*
 * @Author: 20181101remon mindy80230@gmail.com
 * @Date: 2022-05-19 15:34:18
 * @LastEditors: 20181101remon mindy80230@gmail.com
 * @LastEditTime: 2022-05-19 15:34:40
 * @FilePath: \Node.js\test\back\passport.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const users = {}
require('dotenv').config();

// 新增google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
// profile._json內存放妳向google要的使用者資料
      if (profile._json) {
        const id = profile._json.sub
        users[id] = profile._json
        
        //使用者資料存在req內，回傳到後面
        return done(null, users[id])
      }
      //失敗回傳false
      return done(null, false)
    }
  )
)

// 這邊簡單來說就是簡化存在session內的資料，session存放使用者id
// 再用使用者id找出詳細資料
passport.serializeUser((user, done) => {
  return done(null, user.sub)
})
passport.deserializeUser((userId, done) => {
  const user = users[userId]
  return done(null, user)
})

module.exports = passport