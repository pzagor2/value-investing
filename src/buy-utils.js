




//price and amountToSpend are string
function calculateSizeToBuy(price, amountToSpend) {
    const floatPrice = parseFloat(price);
    const floatAmount = parseFloat(amountToSpend);

    let size = (floatAmount / floatPrice).toFixed(8);
    
    //0.01 is min order
    if (size < 0.01) {
        size = 0.01;
    }
    return size.toString();

}

function getFinalPrice(price) {
    let floatPrice = parseFloat(price);
    //We buy 1 unit above the current market price to ensure that our order will be filled
    floatPrice = floatPrice + 0.5;
    return  floatPrice.toString();
}
const BuyUtils = {
    getFinalPrice: getFinalPrice,
    calculateSizeToBuy: calculateSizeToBuy
};

module.exports = BuyUtils;