const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Violation = require('../models/Violation');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

