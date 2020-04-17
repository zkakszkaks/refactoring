/**
 * 다양한 연극을 외주로 받아서 공연하는 극단
 *
 * 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정
 *
 * 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다.
 *
 * 현재 이 극단은 두 가지 장ㄹ, 비극(tragedy)과 희극(comedy)만 공연한다.
 *
 * 그리고 공연료와 별개로 포인트(volume credit)를 지급해서 다음번 의뢰 시 공연료를 할인받을 수도 있다.
 *
 */

// 극단에서 공연한 연극 정보
let plays = {
  hamlet: { name: "Hamlet", type: "tragedy" },
  "as-like": { name: "As You Like It", type: "comedy" },
  othello: { name: "Othello", type: "tragedy" },
};

// 공연료 청구서에 들어갈 데이터
let invoices = [
  {
    customer: "BicCo",
    performances: [
      {
        playID: "hamlet",
        audience: 55,
      },
      {
        playID: "as-like",
        audience: 35,
      },
      {
        playID: "othello",
        audience: 40,
      },
    ],
  },
];

console.log(statement(invoices[0], plays));
// 공연료 청구서를 출력하는 코드
function statement(invoice, plays) {
  let totalAmount = 0; // 총 금액
  let volumeCredits = 0; // 포인트
  let result = `청구 내역 (고객명: ${invoice.customer})\n`; // 고객명 출력
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    // 청구서에서 공연 객체를 하나씩 가져온다.
    const play = plays[perf.playID]; // 공연 정보 객체를 얻는다. (공연 이름과, 공연 타입이 들어있다.)
    let thisAmount = 0;

    switch (
      play.type // 공연이 희극, 비극인지에 따라 금액이 달라진다.
    ) {
      case "tragedy": // 비극
        thisAmount = 40000; // 비극의 기본료는 4만
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30); // 관객수가 30이상 이면 추가되는 관객마다 1000이 더 붙는다.
        }
        break;
      case "comedy": // 희극
        thisAmount = 30000; // 희극의 기본료는 3만
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20); // 관객수가 20명이 초과되면 추가요금 1만이 붙고 사람수마다 500이 더 붙는다.
        }
        thisAmount += 300 * perf.audience; // 마지막으로 관객수 만큼 300 곱한다.
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0); // 관객수가 30명이 초과 되면 포인트 가 추가된다. 30이하면 0점이다.

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" == play.type) volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}
