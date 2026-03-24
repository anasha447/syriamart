package com.syriamart.logistics.mapper;

import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.logistics.dto.response.fulfillment.*;
import com.syriamart.logistics.model.WarehouseInventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface FulfillmentMapper {

    @Mapping(target = "receivedAt",  source = "receivedAt")
    @Mapping(target = "dispatchedAt",source = "dispatchedAt")
    InventoryStatusResponse toStatusResponse(WarehouseInventory inventory);

    List<InventoryStatusResponse> toStatusList(List<WarehouseInventory> inventories);
}
