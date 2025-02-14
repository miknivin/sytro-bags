import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import products from '@/models/Products';
import APIFilters from '@/utlis/apiFilters';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const resPerPage = parseInt(searchParams.get('resPerPage')) || 4;
    const queryParams = Object.fromEntries(searchParams.entries());

    const apiFilters = new APIFilters(products, queryParams).search().filter();

    let filteredProducts = await apiFilters.query;
    const filteredProductsCount = filteredProducts.length;

    apiFilters.pagination(resPerPage);
    filteredProducts = await apiFilters.query.clone();

    return NextResponse.json(
      {
        success: true,
        resPerPage,
        filteredProductsCount,
        filteredProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

