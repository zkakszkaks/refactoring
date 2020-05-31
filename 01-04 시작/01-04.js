/**
 * CHAPTER 01 : 리팩터링: 첫 번째 예시
 * 
 * 다양한 연극을 외주로 받아서 공연하는 극단이 있다.
 * [01] 비용 책정
 * 1. 연극의 장르와 관객 규모를 기초로 비용 책정
 * 
 * [02] 극단이 공연하는 장르
 * 1. 비극(tragedy)
 * 2. 희극(comedy)
 * 
 * [03] 포인트(volume credit)
 * 1. 공연료와 별개로 포인트를 지급해서 다음번 의뢰 시 공연료를 할인 받을 수도 있다.
 */

 /**
  * 극단에서 공연할 연극 정보 plays.json
  */
 let plays = {
   "hamlet": {"name": "Hamlet", "type": "tragedy"},
   "as-like": {"name": "As You Like It", "type": "comedy"},
   "othello": {"name": "Othello", "type": "tragedy"}
 }

 
 /**
  * 공연료 청구서에 들어갈 데이터 invoices.json
  * 
  * BigCo라는 고객이 극단에 공연을 요청함
  * 공연에는 공연id와 관객수가 들어감
  * 
  * 이 공연들의 비용을 책청해서 공연료 청구서를 리턴하도록 해야함.
  * 
  */
 let invoices = [
   {
     "customer": "BigCo",
     "performances": [
       {
         "playID": "hamlet",
         "audience": 55
       },
       {
         "playID": "as-like",
         "audience": 35
       },
       {
         "playID": "othello",
         "audience": 40
       }
     ]
   }
 ]


 statement(invoices[0], plays);
 /**
  * 공연료 청구서를 출력하는 코드
  */
 function statement(invoice, plays) {
   console.log(invoice);
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2}).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy": // 비극
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy": // 희극
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
 }