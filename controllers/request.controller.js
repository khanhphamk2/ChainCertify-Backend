const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { requestService } = require('../services');

const addRequestIssue = catchAsync(async (req, res) => {
    const data = JSON.parse(req.body.jsonData);
    const result = await requestService.addRequestIssue(data, req.file);
    res.status(httpStatus.CREATED).send(result);
});

const addRequestRevoke = catchAsync(async (req, res) => {
    const result = await requestService.addRequestRevoke(req.body);
    res.status(httpStatus.CREATED).send(result);
});

const getRequestIssue = catchAsync(async (req, res) => {
    const request = await requestService.getRequestIssue(req.params.id.toString());
    res.status(httpStatus.OK).send(request);
});

const getRequestRevoke = catchAsync(async (req, res) => {
    const request = await requestService.getRequestRevoke(req.params.id.toString());
    res.status(httpStatus.OK).send(request);
});

const getListRequestIssue = catchAsync(async (req, res) => {
    const request = await requestService.getListRequestIssue(req.params.address);
    res.status(httpStatus.OK).send(request);
});

const getListRequestRevoke = catchAsync(async (req, res) => {
    const request = await requestService.getListRequestRevoke(req.params.address);
    res.status(httpStatus.OK).send(request);
});

const approveRequestIssue = catchAsync(async (req, res) => {
    const result = await requestService.approveRequestIssue(req.body, req.params.id.toString());
    res.status(httpStatus.OK).send(result);
});

const rejectRequestIssue = catchAsync(async (req, res) => {
    const result = await requestService.rejectRequestIssue(req.body, req.params.id.toString());
    res.status(httpStatus.OK).send({
        message: 'Request issue rejected successfully',
        result: result,
    });
});

const approveRequestRevoke = catchAsync(async (req, res) => {
    const result = await requestService.approveRequestRevoke(req.body, req.params.id.toString());
    res.status(httpStatus.OK).send(result);
});

const rejectRequestRevoke = catchAsync(async (req, res) => {
    const result = await requestService.rejectRequestRevoke(req.body, req.params.id.toString());
    res.status(httpStatus.OK).send({
        message: 'Request revoke rejected successfully',
        result: result,
    });
});

module.exports = {
    addRequestIssue,
    addRequestRevoke,
    getRequestIssue,
    getRequestRevoke,
    getListRequestIssue,
    getListRequestRevoke,
    approveRequestIssue,
    approveRequestRevoke,
    rejectRequestIssue,
    rejectRequestRevoke
};