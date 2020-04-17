/**
 * 함수의 반환 값에는 항상 result라는 이름을 쓴다.
 * pref를 aPerformance로 리팩터링
 *
 * 매배변수 이름에 접두어로 타입 이름을 적는다.
 * 매개변수의 역할이 뚜렷하지 않을 때는 부정 관사(a/an)를 붙인다.
 *
 * 컴포터가 이해하는 코드는 바보도 작성할 수 있다. 사람이 이해하도록 작성하는 프로그래머가 진정한 실력자다.
 *
 * play는 개별 공연(aPerformance)에서 얻기 때문에 애초에 매개변수로 전달할 필요가 없다.
 * 그냥 amountFor()안에서 다시 계산하면 된다.
 */
let playes = {
  hamlet: { name: "Hamlet", type: "tragedy" },
  "as-like": { name: "As You Like It", type: "comedy" },
  othello: { name: "Othello", type: "tragedy" },
};

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
  let result = `청구 내역 (고객명: ${invoce.customer})\n`;

  for (let perf of invoce.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(totalAmount() / 100)}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;

  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" == playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }

  function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of invoce.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
  }

  function totalAmount() {
    let totalAmount = 0;
    for (let perf of invoce.performances) {
      totalAmount += amountFor(perf);
    }
    return totalAmount;
  }
}
