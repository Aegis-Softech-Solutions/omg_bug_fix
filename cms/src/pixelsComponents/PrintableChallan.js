import React from "react";
import { Button, Icon } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";

class PrintableChallan extends React.Component {
  printChallanData = () => {
    const {
      invoiceTo,
      Buyer,
      otherDetails,
      invoicColumns,
      rows,
      gstRows,
      gstInvoiceColumns
    } = this.props.printChallanData;

    let primaryXDistance = 5;
    let primaryYDistance = 10;

    //get the jspdf instance into one variable
    var doc = new jsPDF();

    doc.setFontSize(10); //Set the font size

    //now for creating reactnagle which will be the outer border //not necessary
    doc.rect(primaryXDistance, primaryYDistance, 200, 280); //doc.rect("x co-ordinate like margin", "Y-coordinate from top margin", "width of the rectangle", "height of rectangle")

    //no of pages
    let totalPagesExp = "{total_pages_count_string}";
    var pageContent = function(d) {
      //function for repeating the pagecontnet
      // FOOTER
      let str = "Page " + d.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      // if (typeof doc.putTotalPages === "function") {
      //   str = str + " of " + totalPagesExp;
      // }

      doc.text(str, d.settings.margin.left, doc.internal.pageSize.height - 3);

      /////////PURCHASE ORDER HEADING ////////////////////
      doc.text(100, 5, `DELIVERY NOTE`, {
        align: "center"
      });
      /////////PURCHASE ORDER HEADING ////////////////////

      /////////LEFT UPPAR RECTANGLE ////////////////////
      doc.rect(primaryXDistance, primaryYDistance, 100, 100);
      let lineSpacing = 4; //common line spacing
      doc.text(`From,`, primaryXDistance + 5, primaryYDistance + lineSpacing);
      doc.setFontType("bold");
      doc.text(
        invoiceTo.companyName,
        primaryXDistance + 5,
        primaryYDistance + lineSpacing * 2
      );
      doc.setFontType("normal");

      /////////LEFT UPPAR RECTANGLE ////////////////////

      ////////////////////////line //////////////////////////////////////
      doc.line(
        primaryXDistance,
        primaryYDistance + lineSpacing * 10,
        105,
        primaryYDistance + lineSpacing * 10
      );

      ////////////////////////line //////////////////////////////////////

      /////////LEFT SECOND RECTANGLE ////////////////////

      doc.text(
        `To,`,
        primaryXDistance + 5,
        primaryYDistance + lineSpacing * 11
      );

      doc.setFontType("bold");
      doc.text(
        Buyer.companyName,
        primaryXDistance + 5,
        primaryYDistance + lineSpacing * 12
      );

      doc.setFontType("normal");
      let line = doc.splitTextToSize(
        Buyer.addressLine1,
        210 - (primaryXDistance + 5) - 150
      );
      doc.text(line, primaryXDistance + 5, primaryYDistance + lineSpacing * 13);

      /////////LEFT SECOND RECTANGLE ////////////////////

      /////////RIGHT  RECTANGLE ////////////////////
      //now for the right border
      doc.rect(primaryXDistance + 100, primaryYDistance, 100, 100);
      doc.rect(primaryXDistance + 100, primaryYDistance, 50, 10);

      doc.text(
        `Delivery Note No: `,
        primaryXDistance + 105,
        primaryYDistance + lineSpacing
      );

      doc.setFontType("bold");
      doc.text(
        `${otherDetails.voucherNo}`,
        primaryXDistance + 105,
        primaryYDistance + lineSpacing * 2
      );
      doc.setFontType("normal");

      doc.rect(primaryXDistance + 150, primaryYDistance, 50, 10);
      doc.text(
        `Dated on:`,
        primaryXDistance + 155,
        primaryYDistance + lineSpacing
      );

      doc.setFontType("bold");
      doc.text(
        `${otherDetails.datedOn}`,
        primaryXDistance + 155,
        primaryYDistance + lineSpacing * 2
      );
      doc.setFontType("normal");

      /////////RIGHT  RECTANGLE ////////////////////

      ///////////TERMS OF DELIVERY ////////////////

      //////////TERMS OF DELIVERY /////////////////
    };

    doc.autoTable({
      head: invoicColumns,
      body: rows,
      didDrawPage: pageContent,
      margin: {
        top: 115,
        bottom: doc.internal.pageSize.height - 250,
        border: "solid 1px black",
        right: 6,
        left: 6
      },
      theme: "plain",

      styles: {
        tableWidth: "auto",
        overflow: "linebreak",
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        valign: "middle",
        halign: "center",
        cellWidth: "auto"
      },
      columnStyles: {
        0: { cellWidth: 8, minCellHeight: 1, cellBorder: "solid 1px black" },
        1: { cellWidth: 50, minCellHeight: 1, cellBorder: "solid 1px black" }
      } // Cells in 2nd column with personalised width;
    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    console.log(
      "doc.internal.pageSize.height",
      doc.internal.pageSize.height - 297
    );

    doc.autoTable({
      head: gstInvoiceColumns,
      body: gstRows,
      // didDrawPage: pageContent,
      margin: {
        border: "solid 1px black"
      },
      theme: "plain",

      // willDrawCell: function(data) {
      //   var doc = data.doc;
      //   var rows = data.table.body;
      //   if (rows.length === 1) {
      //   } else if (data.row.index === rows.length - 1) {
      //     doc.setFontStyle("bold");
      //     doc.setFontSize("10");
      //     doc.setFillColor(255, 255, 255);
      //   }
      // },
      headStyles: {
        fillColor: [242, 244, 248],
        textColor: [0, 0, 0],
        lineWidth: 0,
        Padding: 0
      },
      styles: {
        tableWidth: "auto",
        overflow: "linebreak",
        fontSize: 9,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        valign: "middle",
        halign: "center",
        cellWidth: "auto"
      },
      columnStyles: {
        0: { cellWidth: 30, minCellHeight: 1, cellBorder: "solid 1px black" },
        8: { cellWidth: 35, minCellHeight: 1, cellBorder: "solid 1px black" }
      } // Cells in 2nd column with personalised width;
    });

    // doc.line(
    //   primaryXDistance,
    //   primaryYDistance + 242,
    //   205,
    //   primaryYDistance + 242
    // );

    /////////////////////SGST/IGST/CGST////////////////////////////////

    /////////////////////SGST/IGST/CGST////////////////////////////////
    //////////////////Amount in words///////////////////////////

    doc.setFontType("normal");

    doc.line(
      primaryXDistance,
      primaryYDistance + 250,
      205,
      primaryYDistance + 250
    );
    //////////////////Amount in words///////////////////////////

    doc.rect(primaryXDistance, primaryYDistance + 250, 100, 30);

    doc.text(`Comments: `, primaryXDistance + 5, primaryYDistance + 255);

    doc.text(
      `For ${otherDetails.companyName},`,
      primaryXDistance + 165,
      primaryYDistance + 255
    );

    doc.text(
      `Authorised Signature`,
      primaryXDistance + 165,
      primaryYDistance + 275
    );
    doc.setFontSize(8);
    doc.text(100, 293, `Declaration`, {
      align: "center"
    });
    doc.text(100, 296, `This is a computer generated invoice`, {
      align: "center"
    });

    window.open(doc.output("bloburl"), "blank");
    // doc.save("Delivery-Note.pdf");
  };

  priceInWords = price => {
    price = Math.round(price);
    var sglDigit = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine"
      ],
      dblDigit = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen"
      ],
      tensPlace = [
        "",
        "Ten",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety"
      ],
      handle_tens = function(dgt, prevDgt) {
        return 0 == dgt
          ? ""
          : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
      },
      handle_utlc = function(dgt, nxtDgt, denom) {
        return (
          (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
          (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        );
      };

    var str = "",
      digitIdx = 0,
      digit = 0,
      nxtDigit = 0,
      words = [];
    if (((price += ""), isNaN(parseInt(price)))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
      for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
        switch (
          ((digit = price[digitIdx] - 0),
          (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
          price.length - digitIdx - 1)
        ) {
          case 0:
            words.push(handle_utlc(digit, nxtDigit, ""));
            break;
          case 1:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 2:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                      ? " and"
                      : "")
                : ""
            );
            break;
          case 3:
            words.push(handle_utlc(digit, nxtDigit, "Thousand"));
            break;
          case 4:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 5:
            words.push(handle_utlc(digit, nxtDigit, "Lakh"));
            break;
          case 6:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 7:
            words.push(handle_utlc(digit, nxtDigit, "Crore"));
            break;
          case 8:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 9:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                      ? " and"
                      : " Crore")
                : ""
            );
        }
      str = words.reverse().join("");
    } else str = "";
    return str.toUpperCase();
  };

  // mathRound = () => {
  //   return Number(Math.round(this + "e" + 2) + "e-" + 2);
  // };

  render() {
    console.log(this.props);
    return (
      <Button
        className="pull-right"
        onClick={() => {
          this.printChallanData();
          //   this.props.setLoading();
        }}
        type="primary"
      >
        Print
        <Icon type="file-pdf" />
      </Button>
    );
  }
}

export default PrintableChallan;
