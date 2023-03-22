const std = @import("std");
const api = @import("./api.zig");

// Represents the merchant configuration for the discount
const Configuration = struct { discountPercentage: f64 = 0, qualifyingProductTotal: f64 = 0 };

// The discount business logic
pub fn function(input: api.FunctionInput, allocator: std.mem.Allocator) ?api.FunctionResult {
    const noDiscount = api.FunctionResult{ .discounts = &[0]api.Discount{}, .discountApplicationStrategy = "MAXIMUM" };

    // If there's no customer on the order yet or they're not a VIP, no discount
    var isVip: bool = false;
    if (input.cart.buyerIdentity) |buyer| if (buyer.customer) |customer|
        if (customer.metafield) |metafield| if (metafield.value) |valueStr|
            if (std.mem.eql(u8, valueStr, "true")) {
                isVip = true;
            };
    if (!isVip) {
        return noDiscount;
    }

    // Parse the discount configuration metafield, which is a string with more JSON
    var config: Configuration = .{};
    if (input.discountNode.metafield) |metafield| if (metafield.value) |configStr| {
        var stream = std.json.TokenStream.init(configStr);
        config = std.json.parse(Configuration, &stream, .{ .allocator = allocator, .ignore_unknown_fields = true }) catch |err| {
            std.debug.print("Error parsing function config: {!}", .{err});
            return noDiscount;
        };
    };
    if (config.discountPercentage == 0 or config.qualifyingProductTotal == 0) {
        return noDiscount;
    }

    // Total all qualifying products. If there aren't enough, no discount
    var qualifyingTotal: f64 = 0;
    for (input.cart.lines) |line| {
        if (line.merchandise.product.isQualifying) {
            qualifyingTotal += std.fmt.parseFloat(f64, line.cost.totalAmount.amount) catch 0;
        }
    }
    if (qualifyingTotal < config.qualifyingProductTotal) {
        return noDiscount;
    }

    // Create an order discount using the configured percentage
    var excludedVariantIds = std.ArrayList([]const u8).init(allocator);
    var targets = std.ArrayList(api.Target).init(allocator);
    targets.append(.{
        .orderSubtotal = api.OrderSubtotalTarget {
            .excludedVariantIds = excludedVariantIds.items
        }
    }) catch |err| {
        std.debug.print("Error allocating target struct: {!}", .{err});
        return noDiscount;
    };

    var discounts = std.ArrayList(api.Discount).init(allocator);
    discounts.append(.{
        .message = "VIP Discount",
        .value = api.Value {
            .percentage = api.Percentage{ .value = config.discountPercentage }
        },
        .targets = targets.items,
    }) catch |err| {
        std.debug.print("Error allocating discount struct: {!}", .{err});
        return noDiscount;
    };

    return api.FunctionResult {
        .discounts = discounts.items,
        .discountApplicationStrategy = "FIRST"
    };
}

// read the function input, calculate the discount, write the function output
pub fn main() u8 {
    // arena allocator is better for short-lived execution like a CLI or Functions
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();

    const allocator = arena.allocator();

    // Read all stdin to an ArrayList
    var inputStr = std.ArrayList(u8).init(allocator);
    var stdin = std.io.getStdIn().reader();
    var buffer: [1024]u8 = undefined;
    while (true) {
        const bytesRead = stdin.read(&buffer) catch |err| {
            std.debug.print("Error reading function input: {!}", .{err});
            return 1;
        };
        if (bytesRead == 0) {
            break; // No more data
        }
        inputStr.appendSlice(buffer[0..bytesRead]) catch |err| {
            std.debug.print("Error reading function input: {!}", .{err});
            return 1;
        };
    }

    var stream = std.json.TokenStream.init(inputStr.items);
    const input = std.json.parse(api.FunctionInput, &stream, .{ .allocator = allocator }) catch |err| {
        std.debug.print("Error parsing function input: {}\n", .{err});
        return 1;
    };

    const result = function(input, allocator);

    std.json.stringify(result, .{}, std.io.getStdOut().writer()) catch |err| {
        std.debug.print("Error serializing function output: {!}", .{err});
        return 1;
    };

    return 0;
}
