const User = require('../models/User')
const db = require('../db/db')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'josuemadingou5@gmail.com',
    pass: 'iyvnvpsgktrxywpb'
  }
})

const emailTemplatePath = path.join('src', 'mails', 'mail.html')
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8')


const createUser = async (req, res) => {
    const { mail } = req.body
    await db.connexion()
    try {
      const isExists = await User.findOne({mail: mail}) 
      if(isExists){
        return res.status(200).json({message: 'Mail déjà existant'})
      } 
      else {
        
          const user = new User(req.body)
          const data = await user.save()
          const msg = 'Utilisateur enregistré avec succès !'

          const emailContent = emailTemplate
            .replace('{{name}}', req.body.nom)
            .replace('{{ mail }}', req.body.mail)
            .replace('{{ numero }}', req.body.tel)
            .replace('{{ statut }}', req.body.statut)

          const mailOptions = {
            from: 'josuemadingou5@gmail.com',
            to: 'madingoujosuepr@gmail.com',
            subject: 'Utilisateur enregistré',
            html: emailContent
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Erreur lors de l\'envoi de l\'email : ', error);
            } else {
              console.log('Email envoyé : ' + info.response);
            }
          });

          return res.status(201).json({message: msg, data: data})
      }

    } catch (error) {
        console.log(error, error.message);
        const msg = 'Erreur lors de l\'enregistrement : '
        return res.status(500).json({message: msg, data: error})
    }
}

const getAllUsers = async (req, res) => {
    await db.connexion();
    try {
      const data = await User.find();
      res.status(200).json({ message: 'Utilisateurs récupérés avec succès', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération : ', error });
    }
    await db.deconnexion();
  };

module.exports = {
    createUser,
    getAllUsers
}