const express = require('express');
const ipfsService = require('../services');
// const multer = require('multer');
const catchAsync = require('../utils/catchAsync');


const upload = catchAsync(upload.single('file'), async (req, res) => {
    await ipfsService.upload();
    res.status(200).send('File uploaded');
});

module.exports = {
    upload
};