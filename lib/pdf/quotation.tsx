import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { BRAND_NAME, CONTACT } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111",
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 20,
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 9,
    color: "#666",
    marginTop: 4,
  },
  quoteMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  label: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    lineHeight: 1.6,
    color: "#333",
  },
  priceBox: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 700,
  },
  listItem: {
    marginBottom: 4,
    paddingLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 12,
    fontSize: 8,
    color: "#888",
  },
});

export type QuotationPdfProps = {
  quoteNumber: string;
  businessName: string;
  contactName: string;
  email: string;
  industry: string;
  projectSummary: string;
  recommendedSolution: string;
  deliverables: string[];
  estimatedTimeline: string;
  priceEstimate: number;
  terms: string;
  issueDate: string;
  carePlan?: {
    name: string;
    monthlyPrice: number;
    includes: string[];
  } | null;
};

export function QuotationPdfDocument(props: QuotationPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>{BRAND_NAME}</Text>
          <Text style={styles.tagline}>Business Automation · Workflows · Software</Text>
          <View style={styles.quoteMeta}>
            <View>
              <Text style={styles.label}>Prepared for</Text>
              <Text>{props.contactName}</Text>
              <Text>{props.businessName}</Text>
              <Text>{props.email}</Text>
            </View>
            <View>
              <Text style={styles.label}>Quotation</Text>
              <Text>{props.quoteNumber}</Text>
              <Text style={styles.label}>Date</Text>
              <Text>{props.issueDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Summary</Text>
          <Text style={styles.body}>{props.projectSummary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Solution</Text>
          <Text style={styles.body}>{props.recommendedSolution}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deliverables</Text>
          {props.deliverables.map((d, i) => (
            <Text key={i} style={styles.listItem}>
              • {d}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline & Investment</Text>
          <Text style={styles.body}>Estimated timeline: {props.estimatedTimeline}</Text>
          <View style={styles.priceBox}>
            <Text style={styles.label}>Build estimate (excl. VAT)</Text>
            <Text style={styles.price}>{formatCurrency(props.priceEstimate)}</Text>
          </View>
          {props.carePlan ? (
            <View style={[styles.priceBox, { marginTop: 12 }]}>
              <Text style={styles.label}>
                Recommended {props.carePlan.name} care (optional, monthly)
              </Text>
              <Text style={styles.price}>
                {formatCurrency(props.carePlan.monthlyPrice)}/mo
              </Text>
              {props.carePlan.includes.map((item, i) => (
                <Text key={i} style={[styles.body, { marginTop: 4 }]}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms</Text>
          <Text style={styles.body}>{props.terms}</Text>
        </View>

        <View style={styles.footer}>
          <Text>
            {BRAND_NAME} · {CONTACT.email} · {CONTACT.phone} · {CONTACT.location}
          </Text>
          <Text>This quotation is valid for 14 days from the issue date.</Text>
        </View>
      </Page>
    </Document>
  );
}
