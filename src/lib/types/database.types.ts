export type MoneyFlow = "income" | "expense";
export type RiskLevel = "bajo" | "medio" | "alto";
export type AssetType = "crypto" | "cedear" | "accion_arg" | "bono_arg";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          kind: MoneyFlow;
          color: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          kind: MoneyFlow;
          color?: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          kind?: MoneyFlow;
          color?: string;
          is_default?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          type: MoneyFlow;
          amount: number;
          description: string | null;
          occurred_on: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          type: MoneyFlow;
          amount: number;
          description?: string | null;
          occurred_on?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          type?: MoneyFlow;
          amount?: number;
          description?: string | null;
          occurred_on?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          asset_type: AssetType;
          symbol: string;
          risk_level: RiskLevel;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          asset_type: AssetType;
          symbol: string;
          risk_level: RiskLevel;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          asset_type?: AssetType;
          symbol?: string;
          risk_level?: RiskLevel;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
