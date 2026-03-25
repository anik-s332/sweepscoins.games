// @ts-nocheck
export default  function generateDynamicMessage(rewardObj) {
    const { timeframe, invitee_conditions } = rewardObj;
    const { mode, value } = timeframe || {};
    const rewardValue = invitee_conditions?.reward / 100;

    let timeframeMsg = '';
    if (timeframe) {
        if (mode === 'hour') {
            timeframeMsg = `within ${value} hour${value > 1 ? 's' : ''} of account opening`;
        } else if (mode === 'day') {
            timeframeMsg = `within ${value} day${value > 1 ? 's' : ''} of account opening`;
        }
    }

    let rewardTypeMsg = '';
    if (invitee_conditions?.reward_type === 'percentage') {
        rewardTypeMsg = `${rewardValue}% cashback`;
    } else if (invitee_conditions?.reward_type === 'fixed') {
        rewardTypeMsg = `get ${rewardValue} credits`;
    }

    let rewardModeMsg = '';
    if (invitee_conditions?.reward_mode === 'account-creation') {
        rewardModeMsg = ``;
    } else if ( invitee_conditions?.reward_mode === 'first-purchase') {
        rewardModeMsg = `on their first purchase`;
    }

    // Combine the message dynamically
    let message = `Earn credits for referrals, plus ${rewardTypeMsg} for new users ${rewardModeMsg}`;
    if (timeframeMsg) {
        message += ` ${timeframeMsg}`;
    }
    message += '!';

    return message;
}
