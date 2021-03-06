/**
 * 다양한 연극을 외주를 받아서 공연하는 극단
 *
 * 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다.
 *
 * 현재 이 극단은 두 가지 장르, 비극(tragedy)과 희극(comdey)만 공연한다.
 *
 * 그리고 공연료과 별개로 포인트(volume credit)를 지급해서 다음번 의뢰 시
 *
 * 공연로를 할인받을 수도 있다.
 *
 */

// 공연할 연극 정보  plays.json
let playes = {
  hamlet: { name: "Hamlet", type: "tragedy" },
  "as-like": { name: "As You Like It", type: "comedy" },
  othello: { name: "Othello", type: "tragedy" },
};
// 공연료 청구서에 들어갈 데이터 invocies.json
let invoices = [
  {
    customer: "BigCo",
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

/**
 * plays.js는 극단에서 공연하는 연극 정보가 들어있다.
 * invoice 납품서 어떤 고객이 어떠 공연이 관객 몇명을 요구하는지 적어있다.
 */

console.log(stattement(invoices[0], playes));
/**
청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점

 * **
 * 공연료 청구서를 출력하는 코드
 */
function stattement(invoce, plays) {
  let totalAmount = 0; // 총 금액
  let volumeCredits = 0; // 포인트
  let result = `청구 내역 (고객명: ${invoce.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format; // 달러단위 소수점 2자리까지 표시한다.

  for (let perf of invoce.performances) {
    // 공연개수 만큼 반복한다.
    const play = plays[perf.playID]; // 납품서의 공연아이디로 공연정보객체를 구한다.
    let thisAmount = 0; // 금액은 0 이다.
    switch (
      play.type // 공연의 타입이 희극인지 비극인지 에따라 금액이 달라진다.
    ) {
      case "tragedy": // 비극이면
        thisAmount = 40000; // 기본금액은 4만
        if (perf.audience > 30) {
          // 남품서서의 곽객수가 30보다크면
          thisAmount += 1000 * (perf.audience - 30); // 기본금액에서 30명이상인 사람마다 1000을 더해준다.
        }
        break;
      case "comedy": // 희극
        thisAmount = 30000; // 희극은 기본금액은 3만이다
        if (perf.audience > 20) {
          // 관객수가 20이상이면
          thisAmount += 10000 + 500 * (perf.audience - 20); // 20명 초과되는 인원마다 500을 곱하고 10000을 더한다
        }
        thisAmount += 300 * perf.audience; // 금액에서 관객수마다 300을 곱해서 누적한다.
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`); // 알수 없는 장르는 에러를 출력한다.
    }
    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0); // 포인트는 30명 초과한 금액에을 넣어준다. 마이너스 값일경우 최소값은 0이다.
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" == play.type) volumeCredits += Math.floor(perf.audience / 5); // 코메디는 관객수를 5로 나누어 포인트를 더 지급한다.

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`; // 공연이름, 금액, 관객수를 출력한다.
    totalAmount += thisAmount; // 총금액에 위에서구한 금액을 더한다
  }

  result += `총액: ${format(totalAmount / 100)}\n`; // 총금액 100으로 나누어 리턴
  result += `적립 포인트: ${volumeCredits}점\n`; // 적립포인터 리턴
  return result;
}
