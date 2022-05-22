const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const {v4: uuidv4} = require('uuid');

app.listen(3000, () => console.log('Server ON, port 3000'));

const { getInvitations,
        getInvitation,
        getInvitationClient,
        registerClient,
        getClient,
        getClientEmail,
        saveInvitation,
        increaseInvitationsUsed,
      } = require("./queries");

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
        partialsDir: `${__dirname}/views/componentes/`
    })
);

app.set("view engine", "handlebars");

// Retorna formulario de inicio
app.get("/", (req, res) => {
    res.render("Index");
});

// Genera link de invitación
app.post("/invitation", async (req, res) => {
    const { email, fullname } = req.body;
    const client = await getClient(email, fullname);
    if (client) {
        let code = '';
        const invitation = await getInvitationClient(client.id);
        if (invitation) {
            code = invitation.code;
        } else {
            code = uuidv4().slice(0,6);
            await saveInvitation(code, client.id);
        }
        const invitationLink = `http://localhost:3000/register/invite/${code}`;
        res.render("Index", { invitationLink });
    } else {
        res.render("Index", { error: 'El cliente no existe, intente nuevamente.' });
    }
});

// Retorna formulario de registro utilizando código de invitación
app.get("/register/invite/*", (req, res) => {
    const url = req.url.split("/");
    const invitationCode = url[url.length - 1];
    res.render("Register", { invitationCode });
});

// Registra nuevo usuario utilizando código de invitación
app.post("/register/invite/*", async (req, res) => {
    const { fullname, email, address, sex, invitationCode } = req.body;
    try {
        if(!fullname.trim() || !email.trim()|| !address.trim() || !sex) {
            throw 'Complete todos los datos.';
        }
        // verifica que el código de la invitación exista
        const invitation = await getInvitation(invitationCode);
        if(invitation) {
            const client = await getClientEmail(email);
            // verifica si el usuario ya existe
            if (client) {
                throw 'El cliente ya se encuentra registrado.';
            } else {
                // registra al cliente
                await registerClient(fullname, email, address, sex);
                // actualiza el numéro de veces que se ha utilizado la invitación
                await increaseInvitationsUsed(invitation.id);
                res.redirect("/management");
                return;
            }
        } else {
            throw 'El código de invitación no es válido.';
        }
    } catch (error) {
        res.render("Register", {invitationCode, error })
    }
});

// Retorna vista de administración con registros exitosos de invitaciones
app.get("/management", async (req, res) => {
    const invitations = await getInvitations();
    res.render("Management", { invitations });
});

// Retorna vista de error de url no encontrada
app.get("*", (req, res) => {
    res.render("Error404");
});


   
    
