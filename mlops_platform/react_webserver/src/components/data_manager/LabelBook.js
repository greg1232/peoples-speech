
import React from 'react';
import ReactMarkdown from 'react-markdown'
import { Box } from '@material-ui/core';

const markdown = `
% Budget and Value Qualification

# Sales Call Process

Money isn't everything, but it certainly has bearing on whether or not a prospect is worth pursuing — so make sure you qualify on budget sooner rather than later. The specific number doesn't matter as much as the fact that your offering's price and the prospect's ability to pay are within the same ballpark. For instance, if your product costs $1 million and the prospect can only afford $100, the sale isn't going to go through so it’s best to disqualify the prospect.

Budget qualification is a tricky thing for salespeople to get right. In my experience, a lot of salespeople qualify on budget in the wrong way and at the wrong time.

The standard sales qualification tactic is to just ask outright, “Do you have a specific budget for this project?” And if they hear a number that’s high enough, they move on, assuming that they have a qualified buyer.

But this approach is more limiting than you might think, especially in a complex sale. By asking this question up front, the salesperson runs the risk of turning off prospects, not getting a straight answer, or even starting a negotiation conversation before they’ve established value.

# Here are four ways talking about budget too soon could derail your deal:
* You might come across as self-serving. When salespeople say, “So that I don’t waste your time, what did you have budgeted for this?” prospects actually hear, “So I can be sure I’m not wasting my time, what did you have budgeted for this?” And that sounds pretty selfish.
* Prospects might lie about their budget. If a prospect is enjoying their conversation with you but doesn't actually have a budget in place, they might invent a number just to keep talking to you.
* You might prompt a premature negotiation. In response to a too-soon budget question, savvy prospects will say, “We have budget, but your competitor already quoted us X price.” Unfortunately, at this early stage, you don’t know much about their needs to determine whether your differentiating factors will allow you to hold your margins. So you could get stuck defending your premium price blindly.
* You might scare your buyer away. Many prospects don’t have a budget in place early on. So if they haven’t yet decided to invest in any solution -- let alone yours -- how can they answer this question intelligently? And this quick, upfront budget qualification approach fails especially miserably if you’re selling a highly differentiated or new product, where the buyer isn’t likely aware they have the problem that your product or service solves. Then they’d have to be psychic in order to have a budget allotted!

# Here are some good qualifying questions:
* What business challenge can this product help you solve?
* What has prevented you from trying to solve the problem until now?
* What does your budget look like for this project?
* Are you using any solutions to solve this problem? If so, why are you switching?
* What is your principal priority in terms of solving this problem? Which functionality would be most important?
* What does success look like for your company after using this product?
* Would you be the daily user of the product? Who in your team would use this product on the daily?
* What are some points of friction in your day-to-day that you feel this product can help you streamline?
* Which decision-makers would be involved in the purchase of this product?
* Would it be all right if I followed up on mm/dd/yyyy?

`

export default class LabelBook extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return <div>
            <Box m={1} sx={{ minWidth: 700, maxWidth: 800 }}>
                <ReactMarkdown children={markdown} />,
            </Box>
        </div>;
    }
}


