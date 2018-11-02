export default (api) => {
    api.all('*', function(req, res, next) {
		res.json({
			success: true,
			code: 200,
			results: res.data
		});
    });
    api.use(function(err, req, res, next) {
		console.log(err);
		console.error(err.stack);
		return !res.headersSent ? res.json({
			success: false,
			code: err.code || 500,
			message: err.message || '',
		}) : null;
    });
}
