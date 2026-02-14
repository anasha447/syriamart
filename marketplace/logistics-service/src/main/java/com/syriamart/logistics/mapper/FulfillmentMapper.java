package com.syriamart.logistics.mapper;

import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.logistics.dto.response.fulfillment.InventoryStatusResponse;
import com.syriamart.logistics.model.WarehouseInventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface FulfillmentMapper {

    @Mapping(target = "quantityOnHand", source = "quantity")
    InventoryStatusResponse toInventoryResponse(WarehouseInventory inventory);
}
