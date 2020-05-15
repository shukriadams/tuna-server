/**
 * Returns the modifier string if count is not one. Count should be numeric, or an array.
 */
module.exports = function(count, modifier = 's'){
    if (Array.isArray(count))
        count = count.length

    if (count === 1)
        return ''

    return modifier
}
