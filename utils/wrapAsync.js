
// 1st method
/* function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
} */

// 2nd method
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};