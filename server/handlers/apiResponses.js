'use strict'

exports.ok = (req, res, next, data) => res.status(200).json(data || {})
exports.created = (req, res, next, data) => res.status(201).json(data || {})
exports.conflict = (req, res, next, data) => res.status(409).json(data || {})
exports.notFound = (req, res) => res.status(404).end()
